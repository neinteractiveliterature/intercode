# frozen_string_literal: true
class ConnectStripeAccountService < CivilService::Service
  validate :convention_must_match_stripe_account_id

  attr_reader :account, :convention

  def initialize(account:, convention:)
    @account = account
    @convention = convention
  end

  private

  def inner_call
    return success unless account.charges_enabled

    Stripe::ApplePayDomain.create({ domain_name: convention.domain }, { stripe_account: account.id })
    convention.update!(stripe_account_ready_to_charge: true)

    success
  end

  def convention_must_match_stripe_account_id
    return if account.id == convention.stripe_account_id

    errors.add :base, "Convention #{convention.name} does not match given stripe account ID #{account.id}"
  end
end
