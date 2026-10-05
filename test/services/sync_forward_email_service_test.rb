# frozen_string_literal: true
require "test_helper"

class SyncForwardEmailServiceTest < ActiveSupport::TestCase
  Request = Struct.new(:http_method, :path, :params)

  setup do
    @original_api_key = ENV.fetch("FORWARDEMAIL_API_KEY", nil)
    ENV["FORWARDEMAIL_API_KEY"] = "test-api-key"
    @stubs = Faraday::Adapter::Test::Stubs.new
    @requests = []
    @reported_errors = []
  end

  teardown { ENV["FORWARDEMAIL_API_KEY"] = @original_api_key }

  def mapping(local, *destinations, domain: "example.com")
    EmailForwardingRouter::Mapping.new(
      inbound_domain: domain,
      inbound_local: local,
      destination_addresses: destinations
    )
  end

  def catch_all(*destinations, domain: "example.com")
    mapping(nil, *destinations, domain:)
  end

  # Responds with a JSON body.  Every request is recorded, so tests can check exactly what was sent to ForwardEmail.
  def stub_api(method, path, body = {}, status: 200, headers: {})
    @stubs.public_send(method, path) do |env|
      params =
        if env.body.is_a?(String) && env.body.present?
          Rack::Utils.parse_nested_query(env.body)
        else
          Rack::Utils.parse_nested_query(env.url.query.to_s)
        end
      @requests << Request.new(env.method, env.url.path, params)
      [status, { "Content-Type" => "application/json" }.merge(headers), body.to_json]
    end
  end

  def stub_domains(*names)
    stub_api(:get, "/v1/domains?pagination=true", names.map { |name| { "name" => name } })
  end

  def stub_aliases(domain, aliases)
    stub_api(:get, "/v1/domains/#{domain}/aliases?pagination=true", aliases)
  end

  def alias_entry(name, recipients, id: SecureRandom.hex(4))
    { "id" => id, "name" => name, "recipients" => recipients }
  end

  def requests_to(method)
    @requests.select { |request| request.http_method == method }
  end

  # Runs the service with the real middleware (auth, form encoding, JSON parsing, raising on errors) in front of the
  # fake HTTP adapter.
  def sync(mappings_by_domain)
    run_sync(mappings_by_domain, :call)
  end

  def sync!(mappings_by_domain)
    run_sync(mappings_by_domain, :call!)
  end

  def run_sync(mappings_by_domain, method)
    original_new = Faraday.method(:new)
    stubs = @stubs
    fake_new =
      lambda do |*args, **kwargs, &block|
        original_new.call(*args, **kwargs) do |conn|
          block.call(conn)
          conn.adapter :test, stubs
        end
      end
    reporter = ->(error, **context) { @reported_errors << [error, context] }

    Faraday.stub(:new, fake_new) do
      ErrorReporting.stub(:error, reporter) { SyncForwardEmailService.new(mappings_by_domain:).public_send(method) }
    end
  end

  describe "adding aliases" do
    it "creates an alias for each mapping that doesn't have one" do
      stub_domains("example.com")
      stub_aliases("example.com", [])
      stub_api(:post, "/v1/domains/example.com/aliases")

      result = sync("example.com" => [mapping("help", "a@gmail.com", "b@gmail.com")])

      assert result.success?
      assert_equal 1, requests_to(:post).size
      assert_equal({ "name" => "help", "recipients" => %w[a@gmail.com b@gmail.com] }, requests_to(:post).first.params)
    end

    it "uses * as the name for a catch-all mapping" do
      stub_domains("example.com")
      stub_aliases("example.com", [])
      stub_api(:post, "/v1/domains/example.com/aliases")

      sync("example.com" => [catch_all("everything@gmail.com")])

      assert_equal "*", requests_to(:post).first.params["name"]
    end
  end

  describe "removing aliases" do
    it "deletes aliases that no longer have a mapping" do
      stub_domains("example.com")
      stub_aliases(
        "example.com",
        [alias_entry("help", ["a@gmail.com"], id: "keep"), alias_entry("old", ["a@gmail.com"], id: "gone")]
      )
      stub_api(:delete, "/v1/domains/example.com/aliases/gone")

      sync("example.com" => [mapping("help", "a@gmail.com")])

      assert_equal ["/v1/domains/example.com/aliases/gone"], requests_to(:delete).map(&:path)
      assert_empty requests_to(:post)
      assert_empty requests_to(:put)
    end

    it "keeps the first of any duplicate aliases and deletes the rest" do
      stub_domains("example.com")
      stub_aliases(
        "example.com",
        [
          alias_entry("help", ["a@gmail.com"], id: "first"),
          alias_entry("help", ["a@gmail.com"], id: "dup1"),
          alias_entry("help", ["a@gmail.com"], id: "dup2")
        ]
      )
      stub_api(:delete, "/v1/domains/example.com/aliases/dup1")
      stub_api(:delete, "/v1/domains/example.com/aliases/dup2")

      sync("example.com" => [mapping("help", "a@gmail.com")])

      assert_equal(
        %w[/v1/domains/example.com/aliases/dup1 /v1/domains/example.com/aliases/dup2],
        requests_to(:delete).map(&:path).sort
      )
    end
  end

  describe "updating aliases" do
    it "updates an alias whose recipients have changed" do
      stub_domains("example.com")
      stub_aliases("example.com", [alias_entry("help", ["old@gmail.com"], id: "abc")])
      stub_api(:put, "/v1/domains/example.com/aliases/abc")

      sync("example.com" => [mapping("help", "new@gmail.com")])

      assert_equal 1, requests_to(:put).size
      assert_equal({ "recipients" => ["new@gmail.com"] }, requests_to(:put).first.params)
    end

    it "leaves an alias alone when it already has the right recipients, whatever their order" do
      stub_domains("example.com")
      stub_aliases("example.com", [alias_entry("help", %w[b@gmail.com a@gmail.com])])

      sync("example.com" => [mapping("help", "a@gmail.com", "b@gmail.com")])

      assert_empty requests_to(:put)
      assert_empty requests_to(:post)
      assert_empty requests_to(:delete)
    end
  end

  describe "domains" do
    it "creates a domain that doesn't exist at ForwardEmail yet, without a catch-all, and then syncs it" do
      stub_domains("other.com")
      stub_api(:post, "/v1/domains")
      stub_aliases("example.com", [])
      stub_api(:post, "/v1/domains/example.com/aliases")

      sync("example.com" => [mapping("help", "a@gmail.com")])

      created_domain = requests_to(:post).find { |request| request.path == "/v1/domains" }
      assert_equal({ "domain" => "example.com", "catchall" => "false" }, created_domain.params)
      assert(requests_to(:post).any? { |request| request.path == "/v1/domains/example.com/aliases" })
    end

    it "syncs every domain" do
      stub_domains("example.com", "other.com")
      stub_aliases("example.com", [])
      stub_aliases("other.com", [])
      stub_api(:post, "/v1/domains/example.com/aliases")
      stub_api(:post, "/v1/domains/other.com/aliases")

      sync(
        "example.com" => [mapping("help", "a@gmail.com")],
        "other.com" => [mapping("info", "b@gmail.com", domain: "other.com")]
      )

      assert_equal(
        %w[/v1/domains/example.com/aliases /v1/domains/other.com/aliases],
        requests_to(:post).map(&:path).sort
      )
    end

    it "does nothing at all if the account has no domains, and counts that as a success" do
      stub_domains

      result = sync!("example.com" => [mapping("help", "a@gmail.com")])

      assert result.success?
      assert_equal 1, @requests.size
    end

    it "keeps going with the other domains if one fails entirely" do
      stub_domains("example.com", "other.com")
      stub_api(:get, "/v1/domains/example.com/aliases?pagination=true", { "message" => "boom" }, status: 500)
      stub_aliases("other.com", [])
      stub_api(:post, "/v1/domains/other.com/aliases")

      sync(
        "example.com" => [mapping("help", "a@gmail.com")],
        "other.com" => [mapping("info", "b@gmail.com", domain: "other.com")]
      )

      assert_equal ["/v1/domains/other.com/aliases"], requests_to(:post).map(&:path)
    end
  end

  describe "pagination" do
    it "reads every page of aliases" do
      stub_domains("example.com")
      stub_api(
        :get,
        "/v1/domains/example.com/aliases?pagination=true",
        [alias_entry("one", ["a@gmail.com"], id: "1")],
        headers: {
          "X-Page-Current" => "1",
          "X-Page-Count" => "2"
        }
      )
      stub_api(
        :get,
        "/v1/domains/example.com/aliases?pagination=true&page=2",
        [alias_entry("two", ["a@gmail.com"], id: "2")],
        headers: {
          "X-Page-Current" => "2",
          "X-Page-Count" => "2"
        }
      )
      stub_api(:delete, "/v1/domains/example.com/aliases/1")
      stub_api(:delete, "/v1/domains/example.com/aliases/2")

      # (no mappings, so every alias found, on either page, is deleted)
      sync("example.com" => [])

      assert_equal(
        %w[/v1/domains/example.com/aliases/1 /v1/domains/example.com/aliases/2],
        requests_to(:delete).map(&:path).sort
      )
    end

    it "reads every page of domains" do
      stub_api(
        :get,
        "/v1/domains?pagination=true",
        [{ "name" => "other.com" }],
        headers: {
          "X-Page-Current" => "1",
          "X-Page-Count" => "2"
        }
      )
      stub_api(
        :get,
        "/v1/domains?pagination=true&page=2",
        [{ "name" => "example.com" }],
        headers: {
          "X-Page-Current" => "2",
          "X-Page-Count" => "2"
        }
      )
      stub_aliases("example.com", [])
      stub_api(:post, "/v1/domains/example.com/aliases")

      sync("example.com" => [mapping("help", "a@gmail.com")])

      # example.com is on the second page, so it must not have been created again
      assert_equal ["/v1/domains/example.com/aliases"], requests_to(:post).map(&:path)
    end
  end

  describe "when individual alias changes fail" do
    it "reports each failure and carries on with the rest" do
      stub_domains("example.com")
      stub_aliases("example.com", [])
      stub_api(:post, "/v1/domains/example.com/aliases", { "message" => "bad" }, status: 400)

      result = sync("example.com" => [mapping("one", "a@gmail.com"), mapping("two", "b@gmail.com")])

      # both were attempted, even though the first failed
      assert_equal %w[one two], requests_to(:post).map { |request| request.params["name"] }.sort
      assert_equal 2, @reported_errors.size
      assert_equal "add_alias", @reported_errors.first.last[:operation]
      assert_equal "example.com", @reported_errors.first.last[:domain]
      # (the failures are logged and reported, but don't fail the sync as a whole)
      assert result.success?
    end

    it "reports a failed delete and still processes the other changes" do
      stub_domains("example.com")
      stub_aliases(
        "example.com",
        [alias_entry("old", ["a@gmail.com"], id: "gone"), alias_entry("help", ["old@gmail.com"], id: "abc")]
      )
      stub_api(:delete, "/v1/domains/example.com/aliases/gone", {}, status: 500)
      stub_api(:put, "/v1/domains/example.com/aliases/abc")

      sync("example.com" => [mapping("help", "new@gmail.com")])

      assert_equal 1, @reported_errors.size
      assert_equal "delete_alias", @reported_errors.first.last[:operation]
      assert_equal 1, requests_to(:put).size
    end
  end

  describe "authentication" do
    it "authenticates with the API key as the basic auth username" do
      seen_authorization = nil
      @stubs.get("/v1/domains?pagination=true") do |env|
        seen_authorization = env.request_headers["Authorization"]
        [200, { "Content-Type" => "application/json" }, [].to_json]
      end

      sync("example.com" => [])

      assert_equal "Basic #{Base64.strict_encode64("test-api-key:")}", seen_authorization
    end
  end

  describe "when listing domains fails" do
    before { stub_api(:get, "/v1/domains?pagination=true", { "message" => "unauthorized" }, status: 401) }

    it "returns a failure with the error" do
      result = sync("example.com" => [mapping("help", "a@gmail.com")])

      assert result.failure?
      assert_kind_of Faraday::UnauthorizedError, result.exception
    end

    it "raises when called with call!, so the job fails visibly" do
      assert_raises(Faraday::UnauthorizedError) { sync!("example.com" => [mapping("help", "a@gmail.com")]) }
    end
  end
end
