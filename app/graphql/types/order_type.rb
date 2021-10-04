# frozen_string_literal: true
class Types::OrderType < Types::BaseObject
  authorize_record

  field :id,
        Integer,
        deprecation_reason:
          'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
        null: false
  field :transitional_id, ID, method: :id, null: false, camelize: true
  field :user_con_profile, Types::UserConProfileType, null: false
  field :status, Types::OrderStatusType, null: false
  field :total_price_before_discounts, Types::MoneyType, null: false
  field :total_price, Types::MoneyType, null: false
  field :payment_amount, Types::MoneyType, null: true
  field :payment_note, String, null: true
  field :charge_id, String, null: true
  field :order_entries, [Types::OrderEntryType], null: false
  field :submitted_at, Types::DateType, null: true
  field :paid_at, Types::DateType, null: true
  field :coupon_applications, [Types::CouponApplicationType], null: false

  field :payment_intent_client_secret, String, null: false do
    description <<~MARKDOWN
      Generates a Stripe PaymentIntent for this order and returns the client secret from that
      PaymentIntent. This can be used to start a payment on the client side, for example using
      Apple Pay or Google Pay.
    MARKDOWN
  end

  def payment_intent_client_secret
    description = object.order_entries.map(&:describe_products).to_sentence
    convention = object.user_con_profile.convention
    intent =
      Stripe::PaymentIntent.create(
        {
          amount: object.total_price.fractional,
          currency: object.total_price.currency,
          description: "#{description} for #{convention.name}",
          statement_descriptor_suffix: PayOrderService.statement_descriptor_suffix(convention),
          metadata: {
            order_id: object.id
          }
        },
        stripe_account: convention.stripe_account_id
      )

    intent.client_secret
  end

  association_loaders Order, :user_con_profile, :order_entries
end
