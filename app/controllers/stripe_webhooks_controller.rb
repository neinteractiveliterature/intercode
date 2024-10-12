# frozen_string_literal: true
class StripeWebhooksController < ApplicationController
  skip_forgery_protection

  def account
    begin
      event = construct_event(ENV.fetch('STRIPE_ACCOUNT_ENDPOINT_SECRET', nil))
    rescue JSON::ParserError => e
      ErrorReporting.warn(e)
      head :not_acceptable
      return
    end

    # case event.type
    # This is where handlers would go if we had any yet
    # else
    ErrorReporting.warn("Unhandled event type for account webhook listener: #{event.type}")

    # end

    head :ok
  end

  def connect
    begin
      event = construct_event(ENV.fetch('STRIPE_CONNECT_ENDPOINT_SECRET', nil))
    rescue JSON::ParserError => e
      ErrorReporting.warn(e)
      head :not_acceptable
      return
    end

    handle_event(event)
    head :ok
  end

  private

  def construct_event(endpoint_secret)
    payload = request.body.read
    sig_header = request.headers['Stripe-Signature']

    Stripe::Webhook.construct_event(payload, sig_header, endpoint_secret)
  end

  def handle_event(event)
    case event.type
    when 'account.application.deauthorized'
      account = event.data.object
      conventions = Convention.where(stripe_account_id: account.id)
      conventions.update_all(stripe_account_id: nil, stripe_account_ready_to_charge: false)
    when 'account.application.authorized', 'account.updated'
      account = event.data.object
      conventions = Convention.where(stripe_account_id: account.id)
      conventions.each do |convention|
        if convention && !convention.stripe_account_ready_to_charge
          ConnectStripeAccountService.new(convention:, account:).call!
        end
      end
    else
      ErrorReporting.warn("Unhandled event type for Connect webhook listener: #{event.type}")
    end
  end
end
