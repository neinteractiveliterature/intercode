# frozen_string_literal: true
require "test_helper"

class HostingServiceAdapters::FlyTest < ActiveSupport::TestCase
  Fly = HostingServiceAdapters::Fly

  setup do
    @original_env =
      ENV.to_h.slice("FLY_APP_NAME", "FLY_API_TOKEN", "FLY_PRIVATE_IP", "FLY_METRICS_TOKEN", "FLY_ORG_SLUG")
    ENV["FLY_APP_NAME"] = "test-app"
    ENV["FLY_API_TOKEN"] = "test-token"
    ENV.delete("FLY_PRIVATE_IP")
    @stubs = Faraday::Adapter::Test::Stubs.new
    @requests = []
  end

  teardown do
    %w[FLY_APP_NAME FLY_API_TOKEN FLY_PRIVATE_IP FLY_METRICS_TOKEN FLY_ORG_SLUG].each { |name| ENV.delete(name) }
    @original_env.each { |name, value| ENV[name] = value }
  end

  let(:adapter) { Fly.new }

  def machine(id, group:, guest: Fly::SMALL_GUEST, state: "started")
    {
      "id" => id,
      "instance_id" => "instance-#{id}",
      "name" => "machine-#{id}",
      "state" => state,
      "region" => "iad",
      "config" => {
        "guest" => guest,
        "image" => "registry.fly.io/test-app:latest",
        "metadata" => {
          "fly_process_group" => group
        }
      }
    }
  end

  # Stubs the Machines API: every request is recorded, then answered with the given JSON
  def stub_api(method, path, body = {}, status: 200)
    @stubs.public_send(method, path) do |env|
      parsed_body = env.body.is_a?(String) && env.body.present? ? JSON.parse(env.body) : nil
      @requests << { method: env.method, path: env.url.request_uri, body: parsed_body }
      [status, { "Content-Type" => "application/json" }, body.to_json]
    end
  end

  def with_stubbed_api(&)
    connection =
      Faraday.new(url: "https://api.machines.dev") do |builder|
        builder.request :json
        builder.response :json
        builder.response :raise_error
        builder.adapter :test, @stubs
      end

    adapter.stub(:machines_api, connection, &)
  end

  def requests_matching(method)
    @requests.select { |request| request[:method] == method }
  end

  describe "#applicable?" do
    it "is applicable with a Fly app name and API token" do
      assert adapter.applicable?
    end

    it "is not applicable without an app name" do
      ENV.delete("FLY_APP_NAME")

      assert_not adapter.applicable?
    end

    it "is not applicable without an API token" do
      ENV.delete("FLY_API_TOKEN")

      assert_not adapter.applicable?
    end
  end

  describe ".find_adapter" do
    it "finds the Fly adapter when running on Fly" do
      assert_kind_of Fly, HostingServiceAdapters.find_adapter
    end

    it "finds nothing elsewhere" do
      ENV.delete("FLY_APP_NAME")

      assert_nil HostingServiceAdapters.find_adapter
    end
  end

  describe "the machines API" do
    it "uses the public API by default and the private network when there is a private IP" do
      assert_equal "https://api.machines.dev", adapter.send(:machines_api_base)

      ENV["FLY_PRIVATE_IP"] = "fdaa::1"

      assert_equal "http://_api.internal:4280", Fly.new.send(:machines_api_base)
    end
  end

  describe "#instances_state" do
    it "describes each machine by its process group and size" do
      stub_api(
        :get,
        "/v1/apps/test-app/machines",
        [
          machine("w1", group: "web", guest: Fly::SMALL_GUEST),
          machine("w2", group: "web", guest: Fly::MEDIUM_GUEST),
          machine("s1", group: "shoryuken", guest: Fly::LARGE_GUEST),
          machine("o1", group: "console", guest: { "cpu_kind" => "shared", "cpus" => 8, "memory_mb" => 4096 })
        ]
      )

      with_stubbed_api do
        instances = adapter.instances_state.instances

        assert_equal(
          [%i[web small], %i[web medium], %i[worker large], %i[other other]],
          instances.map { |instance| [instance.group, instance.type] }
        )
        assert_equal %w[w1 w2 s1 o1], instances.map(&:id)
        assert_equal "instance-w1", instances.first.instance_id
        assert_equal "iad", instances.first.region
        assert_equal "started", instances.first.state
      end
    end

    it "asks the API only once until the state is invalidated" do
      stub_api(:get, "/v1/apps/test-app/machines", [machine("w1", group: "web")])

      with_stubbed_api do
        adapter.instances_state
        adapter.instances_state

        assert_equal 1, requests_matching(:get).size

        adapter.invalidate_state
        adapter.instances_state

        assert_equal 2, requests_matching(:get).size
      end
    end

    it "fetches fresh state when forced" do
      stub_api(:get, "/v1/apps/test-app/machines", [machine("w1", group: "web")])

      with_stubbed_api do
        adapter.instances_state
        adapter.force_refresh_state

        assert_equal 2, requests_matching(:get).size
      end
    end

    it "raises when the API does" do
      stub_api(:get, "/v1/apps/test-app/machines", { "error" => "nope" }, status: 500)

      with_stubbed_api { assert_raises(Faraday::ServerError) { adapter.instances_state } }
    end
  end

  describe "#update_instance_group" do
    describe "when there are too few machines" do
      it "creates the missing ones like an existing machine in the group, in the requested size, and waits" do
        stub_api(
          :get,
          "/v1/apps/test-app/machines",
          [machine("w1", group: "web", guest: Fly::SMALL_GUEST), machine("s1", group: "shoryuken")]
        )
        stub_api(:post, "/v1/apps/test-app/machines", { "id" => "new1", "name" => "new-machine-1" })
        stub_api(:get, "/v1/apps/test-app/machines/new1/wait?state=started")

        with_stubbed_api { adapter.update_instance_group(group: :web, type: :medium, count: 1) }

        created = requests_matching(:post)
        assert_equal 1, created.size
        assert_equal "iad", created.first[:body]["region"]
        assert_equal Fly::MEDIUM_GUEST, created.first[:body]["config"]["guest"]
        assert_equal "web", created.first[:body]["config"]["metadata"]["fly_process_group"]
        assert_equal "registry.fly.io/test-app:latest", created.first[:body]["config"]["image"]
        assert_includes @requests.pluck(:path), "/v1/apps/test-app/machines/new1/wait?state=started"
      end

      it "creates as many as are missing" do
        stub_api(:get, "/v1/apps/test-app/machines", [machine("w1", group: "web")])
        stub_api(:post, "/v1/apps/test-app/machines", { "id" => "new", "name" => "new-machine" })
        stub_api(:get, "/v1/apps/test-app/machines/new/wait?state=started")

        with_stubbed_api { adapter.update_instance_group(group: :web, type: :small, count: 4) }

        assert_equal 3, requests_matching(:post).size
      end

      it "counts only machines of the right size" do
        stub_api(:get, "/v1/apps/test-app/machines", [machine("w1", group: "web", guest: Fly::SMALL_GUEST)])
        stub_api(:post, "/v1/apps/test-app/machines", { "id" => "new", "name" => "new-machine" })
        stub_api(:get, "/v1/apps/test-app/machines/new/wait?state=started")

        with_stubbed_api { adapter.update_instance_group(group: :web, type: :medium, count: 1) }

        assert_equal 1, requests_matching(:post).size
      end

      it "forgets what it knew about the machines afterwards" do
        stub_api(:get, "/v1/apps/test-app/machines", [machine("w1", group: "web")])
        stub_api(:post, "/v1/apps/test-app/machines", { "id" => "new", "name" => "new-machine" })
        stub_api(:get, "/v1/apps/test-app/machines/new/wait?state=started")

        with_stubbed_api do
          adapter.update_instance_group(group: :web, type: :small, count: 2)
          adapter.instances_state

          assert_equal(2, requests_matching(:get).count { |request| request[:path] == "/v1/apps/test-app/machines" })
        end
      end
    end

    describe "when there are too many machines" do
      it "stops, waits for and destroys the surplus" do
        stub_api(
          :get,
          "/v1/apps/test-app/machines",
          [machine("w1", group: "web"), machine("w2", group: "web"), machine("w3", group: "web")]
        )
        stub_api(:post, "/v1/apps/test-app/machines/w1/stop")
        stub_api(:post, "/v1/apps/test-app/machines/w2/stop")
        stub_api(:get, "/v1/apps/test-app/machines/w1/wait?state=stopped&instance_id=instance-w1")
        stub_api(:get, "/v1/apps/test-app/machines/w2/wait?state=stopped&instance_id=instance-w2")
        stub_api(:delete, "/v1/apps/test-app/machines/w1")
        stub_api(:delete, "/v1/apps/test-app/machines/w2")

        with_stubbed_api { adapter.update_instance_group(group: :web, type: :small, count: 1) }

        assert_equal(%w[w1 w2], requests_matching(:post).pluck(:path).map { |path| path[%r{machines/(\w+)/stop}, 1] })
        assert_equal(
          %w[/v1/apps/test-app/machines/w1 /v1/apps/test-app/machines/w2],
          requests_matching(:delete).pluck(:path)
        )
      end
    end

    it "does nothing when there are already the right number" do
      stub_api(:get, "/v1/apps/test-app/machines", [machine("w1", group: "web"), machine("w2", group: "web")])

      with_stubbed_api { adapter.update_instance_group(group: :web, type: :small, count: 2) }

      assert_equal 1, @requests.size
    end
  end

  describe "#apply_instance_counts" do
    it "brings each group to its target and removes machines of sizes that are no longer wanted" do
      stub_api(
        :get,
        "/v1/apps/test-app/machines",
        [
          machine("w1", group: "web", guest: Fly::SMALL_GUEST),
          machine("w2", group: "web", guest: Fly::SMALL_GUEST),
          machine("s1", group: "shoryuken", guest: Fly::LARGE_GUEST)
        ]
      )
      stub_api(:post, "/v1/apps/test-app/machines", { "id" => "new", "name" => "new-machine" })
      stub_api(:get, "/v1/apps/test-app/machines/new/wait?state=started")
      stub_api(:post, "/v1/apps/test-app/machines/s1/stop")
      stub_api(:get, "/v1/apps/test-app/machines/s1/wait?state=stopped&instance_id=instance-s1")
      stub_api(:delete, "/v1/apps/test-app/machines/s1")

      with_stubbed_api do
        adapter.apply_instance_counts(
          [{ group: :web, type: :small, count: 2 }, { group: :worker, type: :small, count: 1 }]
        )

        # one new small worker (cloned from the existing worker), and the old large worker is gone
        assert_equal(1, requests_matching(:post).count { |request| request[:body] })
        assert_includes requests_matching(:delete).pluck(:path), "/v1/apps/test-app/machines/s1"
      end
    end
  end

  describe "#seconds_until_cpu_exhaustion" do
    before do
      ENV["FLY_METRICS_TOKEN"] = "metrics-token"
      ENV["FLY_ORG_SLUG"] = "test-org"
      stub_api(
        :get,
        "/v1/apps/test-app/machines",
        [
          machine("w1", group: "web"),
          machine("w2", group: "web"),
          machine("w3", group: "web", guest: Fly::LARGE_GUEST),
          machine("s1", group: "shoryuken")
        ]
      )
    end

    def metric_response(values)
      {
        "status" => "success",
        "data" => {
          "result" =>
            values.map { |instance, value| { "metric" => { "instance" => instance }, "value" => [1, value.to_s] } }
        }
      }
    end

    def with_stubbed_metrics(balances:, trends:, &)
      queries = []
      metrics_stubs = Faraday::Adapter::Test::Stubs.new
      metrics_stubs.get("/api/v1/query") do |env|
        query = env.params["query"]
        queries << query
        [
          200,
          { "Content-Type" => "application/json" },
          metric_response(query.start_with?("deriv") ? trends : balances).to_json
        ]
      end
      connection =
        Faraday.new(url: "https://api.fly.io/prometheus/test-org") do |builder|
          builder.response :json
          builder.response :raise_error
          builder.adapter :test, metrics_stubs
        end

      with_stubbed_api { adapter.stub(:metrics_api, connection, &) }
      queries
    end

    it "is the balance divided by the rate it is draining, for the machine with the least time left" do
      result = nil
      with_stubbed_metrics(balances: { "w1" => 6000, "w2" => 3000 }, trends: { "w1" => -2, "w2" => -5 }) do
        result = adapter.seconds_until_cpu_exhaustion(group: :web)
      end

      assert_in_delta 600, result, 0.001
    end

    it "ignores machines that are not draining and machines in other groups" do
      result = nil
      with_stubbed_metrics(
        balances: {
          "w1" => 6000,
          "w2" => 50_000,
          "s1" => 10
        },
        trends: {
          "w1" => 0.5,
          "w2" => 0,
          "s1" => -5
        }
      ) { result = adapter.seconds_until_cpu_exhaustion(group: :web) }

      assert_nil result
    end

    it "treats a machine with an empty balance as already out, whatever its trend" do
      result = nil
      with_stubbed_metrics(balances: { "w1" => 0, "w2" => 50_000 }, trends: { "w1" => 0, "w2" => -1 }) do
        result = adapter.seconds_until_cpu_exhaustion(group: :web)
      end

      assert_equal 0, result
    end

    it "does not count performance machines, which have no burst balance" do
      result = nil
      with_stubbed_metrics(balances: { "w3" => 0 }, trends: { "w3" => -1 }) do
        result = adapter.seconds_until_cpu_exhaustion(group: :web)
      end

      assert_nil result
    end

    it "is nil without a metrics token or org" do
      ENV.delete("FLY_METRICS_TOKEN")

      assert_nil adapter.seconds_until_cpu_exhaustion(group: :web)
    end

    it "is nil, rather than raising, when the metrics API fails" do
      failing = Faraday::Adapter::Test::Stubs.new
      failing.get("/api/v1/query") { [500, {}, "boom"] }
      connection =
        Faraday.new(url: "https://api.fly.io/prometheus/test-org") do |builder|
          builder.response :raise_error
          builder.adapter :test, failing
        end

      with_stubbed_api do
        adapter.stub(:metrics_api, connection) { assert_nil adapter.seconds_until_cpu_exhaustion(group: :web) }
      end
    end
  end
end
