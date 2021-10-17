# frozen_string_literal: true
class Types::StripeAccountType < Types::BaseObject
  field :id, ID, null: false
  field :email, String, null: true
  field :charges_enabled, Boolean, null: false
  field :display_name, String, null: true

  def display_name
    object.settings&.dashboard&.display_name
  end

  def email
    # in case Stripe didn't return it, which it apparently sometimes doesn't
    object['email']
  end

  field :account_onboarding_link, String, null: false do
    argument :base_url, String, required: true, camelize: false
  end

  def account_onboarding_link(base_url:)
    refresh_url = URI.parse(base_url)
    refresh_url.path = '/stripe_account/refresh'

    return_url = URI.parse(base_url)
    return_url.path = '/stripe_account/return'

    Stripe::AccountLink.create(
      { account: object.id, refresh_url: refresh_url.to_s, return_url: return_url.to_s, type: 'account_onboarding' }
    ).url
  end
end
