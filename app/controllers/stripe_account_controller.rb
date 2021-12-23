# frozen_string_literal: true
class StripeAccountController < ApplicationController
  before_action :ensure_authorized

  def return
    acct = Stripe::Account.retrieve(convention.stripe_account_id)
    ConnectStripeAccountService.new(convention: convention, account: acct).call!

    redirect_to '/convention/edit#payments'
  end

  def refresh
    account_link =
      Stripe::AccountLink.create(
        {
          account: convention.stripe_account_id,
          refresh_url: stripe_account_refresh_url,
          return_url: stripe_accont_return_url,
          type: 'account_onboarding'
        }
      )

    redirect_to account_link.url, allow_other_host: true
  end

  private

  def ensure_authorized
    authorize convention, :update?
  end
end
