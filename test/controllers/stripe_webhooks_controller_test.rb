# frozen_string_literal: true
require "test_helper"

describe StripeWebhooksController do
  let(:connect_secret) { "whsec_connect_test" }
  let(:account_secret) { "whsec_account_test" }
  let(:convention) { create(:convention, stripe_account_id: "acct_123", stripe_account_ready_to_charge: true) }

  setup do
    convention
    @original_env = ENV.to_h.slice("STRIPE_CONNECT_ENDPOINT_SECRET", "STRIPE_ACCOUNT_ENDPOINT_SECRET")
    ENV["STRIPE_CONNECT_ENDPOINT_SECRET"] = connect_secret
    ENV["STRIPE_ACCOUNT_ENDPOINT_SECRET"] = account_secret
  end

  teardown do
    %w[STRIPE_CONNECT_ENDPOINT_SECRET STRIPE_ACCOUNT_ENDPOINT_SECRET].each do |key|
      @original_env.key?(key) ? ENV[key] = @original_env[key] : ENV.delete(key)
    end
  end

  def event_payload(type, account_attrs = {})
    {
      id: "evt_123",
      object: "event",
      type:,
      data: {
        object: { id: "acct_123", object: "account", charges_enabled: true }.merge(account_attrs)
      }
    }.to_json
  end

  def signed_post(action, payload, secret)
    timestamp = Time.zone.now
    signature = Stripe::Webhook::Signature.compute_signature(timestamp, payload, secret)
    @request.headers["Stripe-Signature"] = Stripe::Webhook::Signature.generate_header(timestamp, signature)
    post action, body: payload
  end

  describe "POST connect" do
    it "clears the Stripe account when the platform is deauthorized" do
      signed_post :connect, event_payload("account.application.deauthorized"), connect_secret

      assert_response :ok
      convention.reload
      assert_nil convention.stripe_account_id
      assert_not convention.stripe_account_ready_to_charge
    end

    it "only clears conventions connected to the deauthorized account" do
      other_convention = create(:convention, stripe_account_id: "acct_other", stripe_account_ready_to_charge: true)
      signed_post :connect, event_payload("account.application.deauthorized"), connect_secret

      other_convention.reload
      assert_equal "acct_other", other_convention.stripe_account_id
      assert other_convention.stripe_account_ready_to_charge
    end

    %w[account.application.authorized account.updated].each do |event_type|
      describe event_type do
        it "marks a not-yet-ready convention as ready to charge once charges are enabled" do
          convention.update!(stripe_account_ready_to_charge: false)

          Stripe::ApplePayDomain.stub(:create, nil) { signed_post :connect, event_payload(event_type), connect_secret }

          assert_response :ok
          assert convention.reload.stripe_account_ready_to_charge
        end

        it "leaves the convention alone if charges aren't enabled yet" do
          convention.update!(stripe_account_ready_to_charge: false)

          signed_post :connect, event_payload(event_type, charges_enabled: false), connect_secret

          assert_response :ok
          assert_not convention.reload.stripe_account_ready_to_charge
        end

        it "doesn't reconnect a convention that's already ready to charge" do
          registered = []
          Stripe::ApplePayDomain.stub(:create, ->(*args) { registered << args }) do
            signed_post :connect, event_payload(event_type), connect_secret
          end

          assert_response :ok
          assert_empty registered
        end
      end
    end

    it "registers the convention's domain with Apple Pay on the connected account" do
      convention.update!(stripe_account_ready_to_charge: false)
      registered = []

      Stripe::ApplePayDomain.stub(:create, ->(*args) { registered << args }) do
        signed_post :connect, event_payload("account.updated"), connect_secret
      end

      assert_equal [[{ domain_name: convention.domain }, { stripe_account: "acct_123" }]], registered
    end

    it "acknowledges and warns about event types it doesn't handle" do
      warnings = []
      ErrorReporting.stub(:warn, ->(message) { warnings << message }) do
        signed_post :connect, event_payload("charge.refunded"), connect_secret
      end

      assert_response :ok
      assert_equal ["Unhandled event type for Connect webhook listener: charge.refunded"], warnings
    end

    it "rejects payloads that aren't valid JSON" do
      ErrorReporting.stub(:warn, nil) { signed_post :connect, "this is not json", connect_secret }

      assert_response :not_acceptable
    end

    it "does not process events signed with the wrong secret" do
      assert_raises(Stripe::SignatureVerificationError) do
        signed_post :connect, event_payload("account.application.deauthorized"), "whsec_wrong"
      end

      assert_equal "acct_123", convention.reload.stripe_account_id
    end

    it "does not process events with no signature" do
      assert_raises(Stripe::SignatureVerificationError) do
        post :connect, body: event_payload("account.application.deauthorized")
      end

      assert_equal "acct_123", convention.reload.stripe_account_id
    end

    it "does not accept events signed with the account endpoint's secret" do
      assert_raises(Stripe::SignatureVerificationError) do
        signed_post :connect, event_payload("account.application.deauthorized"), account_secret
      end

      assert_equal "acct_123", convention.reload.stripe_account_id
    end
  end

  describe "POST account" do
    it "acknowledges events and warns that there's no handler for them" do
      warnings = []
      ErrorReporting.stub(:warn, ->(message) { warnings << message }) do
        signed_post :account, event_payload("account.updated"), account_secret
      end

      assert_response :ok
      assert_equal ["Unhandled event type for account webhook listener: account.updated"], warnings
    end

    it "rejects payloads that aren't valid JSON" do
      ErrorReporting.stub(:warn, nil) { signed_post :account, "this is not json", account_secret }

      assert_response :not_acceptable
    end

    it "does not accept events signed with the wrong secret" do
      assert_raises(Stripe::SignatureVerificationError) do
        signed_post :account, event_payload("account.updated"), connect_secret
      end
    end
  end
end
