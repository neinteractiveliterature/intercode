class StripeAccountController < ApplicationController
  before_action :ensure_authorized

  def return
    acct = Stripe::Account.retrieve(convention.stripe_account_id)

    if acct.charges_enabled
      convention.update!(stripe_account_ready_to_charge: true)
    end

    redirect_to '/convention/edit'
  end

  def refresh
    account_link = Stripe::AccountLink.create({
      account: convention.stripe_account_id,
      refresh_url: stripe_account_refresh_url,
      return_url: stripe_accont_return_url,
      type: 'account_onboarding'
    })

    redirect_to account_link.url
  end

  private

  def ensure_authorized
    authorize convention, :update?
  end
end
