# frozen_string_literal: true
require "test_helper"

class SyncEmailForwardingForDomainJobTest < ActiveJob::TestCase
  let(:convention) { create(:convention, domain: "example.com") }

  setup do
    @original_api_key = ENV.fetch("FORWARDEMAIL_API_KEY", nil)
    create(:staff_position, convention:, email: "staff@example.com")
  end

  teardown { ENV["FORWARDEMAIL_API_KEY"] = @original_api_key }

  # Records what the job asked the sync service to do, instead of calling out to ForwardEmail
  def run_job(domains)
    calls = []
    fake_service = Struct.new(:mappings_by_domain) { def call! = nil }
    SyncForwardEmailService.stub(
      :new,
      lambda do |mappings_by_domain:|
        calls << mappings_by_domain
        fake_service.new(mappings_by_domain)
      end
    ) { SyncEmailForwardingForDomainJob.perform_now(domains) }
    calls
  end

  it "syncs the mappings for the domain when ForwardEmail is configured" do
    ENV["FORWARDEMAIL_API_KEY"] = "test-api-key"

    calls = run_job("example.com")

    assert_equal 1, calls.size
    assert_equal ["example.com"], calls.first.keys
    assert_equal ["staff@example.com"], calls.first["example.com"].map(&:inbound_email)
  end

  it "accepts several domains at once" do
    ENV["FORWARDEMAIL_API_KEY"] = "test-api-key"

    calls = run_job(%w[example.com other.com])

    assert_equal 1, calls.size
    assert_includes calls.first.keys, "example.com"
  end

  it "does nothing when there is no ForwardEmail API key" do
    ENV["FORWARDEMAIL_API_KEY"] = nil

    assert_empty run_job("example.com")
  end

  it "does nothing when the API key is blank" do
    ENV["FORWARDEMAIL_API_KEY"] = ""

    assert_empty run_job("example.com")
  end
end
