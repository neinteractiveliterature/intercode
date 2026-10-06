# frozen_string_literal: true
require "test_helper"

class Intercode::VirtualHostTest < ActiveSupport::TestCase
  describe Intercode::VirtualHostConstraint do
    let(:constraint) { Intercode::VirtualHostConstraint.new }

    it "matches requests that were mapped to a convention" do
      convention = create(:convention)
      request = ActionDispatch::Request.new("intercode.convention" => convention)

      assert constraint.matches?(request)
    end

    it "does not match requests for the root site" do
      assert_not constraint.matches?(ActionDispatch::Request.new({}))
      assert_not constraint.matches?(ActionDispatch::Request.new("intercode.convention" => nil))
    end
  end

  describe ".with_virtual_host_domain" do
    it "overrides the domain inside the block, and gives it back afterwards" do
      assert_nil Intercode.overridden_virtual_host_domain

      Intercode.with_virtual_host_domain("example.com") do
        assert_equal "example.com", Intercode.overridden_virtual_host_domain
      end

      assert_nil Intercode.overridden_virtual_host_domain
    end

    it "gives it back even if the block raises" do
      assert_raises(RuntimeError) { Intercode.with_virtual_host_domain("example.com") { raise "boom" } }

      assert_nil Intercode.overridden_virtual_host_domain
    end

    it "returns what the block returns" do
      assert_equal 42, Intercode.with_virtual_host_domain("example.com") { 42 }
    end
  end

  describe Intercode::FindVirtualHost do
    let(:downstream) { ->(env) { [200, {}, [env["intercode.convention"]&.name.to_s]] } }
    let(:middleware) { Intercode::FindVirtualHost.new(downstream) }
    let(:convention) { create(:convention, name: "Mapped Con", domain: "mapped.example.com") }

    def request_env(host: "mapped.example.com", path: "/", **extra)
      Rack::MockRequest.env_for("http://#{host}#{path}", extra)
    end

    def found_convention(env)
      middleware.call(env)
      env["intercode.convention"]
    end

    it "maps a request to the convention with its domain" do
      convention

      assert_equal convention, found_convention(request_env)
    end

    it "maps a request for an unknown domain to no convention, meaning the root site" do
      convention

      assert_nil found_convention(request_env(host: "unknown.example.com"))
    end

    it "passes the request on to the app" do
      convention

      assert_equal [200, {}, ["Mapped Con"]], middleware.call(request_env)
    end

    it "prefers a convention domain header from a front-end proxy to the host" do
      convention

      env = request_env(:host => "proxy.internal", "HTTP_X_INTERCODE_CONVENTION_DOMAIN" => "mapped.example.com")

      assert_equal convention, found_convention(env)
    end

    it "prefers an overridden domain to both" do
      convention
      other = create(:convention, domain: "other.example.com")

      Intercode.with_virtual_host_domain("other.example.com") do
        env = request_env(:host => "mapped.example.com", "HTTP_X_INTERCODE_CONVENTION_DOMAIN" => "mapped.example.com")

        assert_equal other, found_convention(env)
      end
    end

    it "leaves a convention that an earlier layer already chose alone" do
      convention
      chosen = create(:convention, domain: "chosen.example.com")

      env = request_env("intercode.convention" => chosen)

      assert_equal chosen, found_convention(env)
    end

    it "does not look up a convention for asset requests" do
      convention
      env = request_env(path: "#{Rails.application.config.assets.prefix}/application.js")

      middleware.call(env)

      assert_not env.key?("intercode.convention")
    end

    it "says how it mapped the request when debugging is turned on" do
      convention
      messages = []
      original = ENV.fetch("FIND_VIRTUAL_HOST_DEBUG", nil)
      ENV["FIND_VIRTUAL_HOST_DEBUG"] = "1"

      Rails
        .logger
        .stub(:info, ->(message) { messages << message }) do
          middleware.call(request_env)
          middleware.call(request_env(host: "unknown.example.com"))
        end

      assert_match(/mapped.example.com mapped\s+to\s+Mapped Con/m, messages.first)
      assert_match(/unknown.example.com mapped to root site/, messages.second)
    ensure
      ENV["FIND_VIRTUAL_HOST_DEBUG"] = original
    end
  end
end
