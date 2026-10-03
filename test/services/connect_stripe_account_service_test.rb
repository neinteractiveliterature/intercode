# frozen_string_literal: true
require "test_helper"

describe ConnectStripeAccountService do
  let(:convention) { create(:convention, stripe_account_id: "acct_123", stripe_account_ready_to_charge: false) }

  def account(id: "acct_123", charges_enabled: true)
    Struct.new(:id, :charges_enabled).new(id, charges_enabled)
  end

  it "registers the convention's domain for Apple Pay and marks it ready to charge" do
    registered = []

    Stripe::ApplePayDomain.stub(:create, ->(*args) { registered << args }) do
      result = ConnectStripeAccountService.new(convention:, account: account).call
      assert result.success?
    end

    assert_equal [[{ domain_name: convention.domain }, { stripe_account: "acct_123" }]], registered
    assert convention.reload.stripe_account_ready_to_charge
  end

  it "does nothing yet if the account can't charge" do
    Stripe::ApplePayDomain.stub(:create, ->(*) { flunk "should not register a domain" }) do
      result = ConnectStripeAccountService.new(convention:, account: account(charges_enabled: false)).call
      assert result.success?
    end

    assert_not convention.reload.stripe_account_ready_to_charge
  end

  it "refuses to connect an account that isn't the convention's Stripe account" do
    Stripe::ApplePayDomain.stub(:create, ->(*) { flunk "should not register a domain" }) do
      result = ConnectStripeAccountService.new(convention:, account: account(id: "acct_other")).call

      assert result.failure?
      assert_match(/does not match given stripe account ID acct_other/, result.errors.full_messages.join)
    end

    assert_not convention.reload.stripe_account_ready_to_charge
  end

  it "leaves the convention unready if registering the domain fails" do
    failing = ->(*) { raise Stripe::InvalidRequestError.new("nope", "domain_name") }

    Stripe::ApplePayDomain.stub(:create, failing) do
      assert_raises(Stripe::InvalidRequestError) do
        ConnectStripeAccountService.new(convention:, account: account).call!
      end
    end

    assert_not convention.reload.stripe_account_ready_to_charge
  end
end
