# frozen_string_literal: true
class Types::OrderType < Types::BaseObject
  description "A purchase, or a shopping cart that has not yet been paid for"
  authorize_record

  field :charge_id, String, null: true, description: "The payment processor's ID for the charge, if one was made"
  field :coupon_applications,
        [Types::CouponApplicationType],
        null: false,
        description: "The coupons applied to this order"
  field :id, ID, null: false, description: "The ID of this order"
  field :order_entries,
        [Types::OrderEntryType],
        association_model: Order,
        null: false,
        description: "The lines of this order"
  field :paid_at, Types::DateType, null: true, description: "When this order was paid for"
  field :payment_amount, Types::MoneyType, null: true, description: "The amount paid"
  field :payment_note, String, null: true, description: "A note about how this order was paid"
  field :status, Types::OrderStatusType, null: false, description: "Where this order is in the purchasing process"
  field :submitted_at, Types::DateType, null: true, description: "When this order was submitted"
  field :total_price, Types::MoneyType, null: false, description: "The price after discounts"
  # rubocop:disable-next GraphQL/ExtractType
  field :total_price_before_discounts, Types::MoneyType, null: false, description: "The price before discounts"
  field :user_con_profile,
        Types::UserConProfileType,
        association_model: Order,
        null: false,
        description: "The person who placed this order"

  # rubocop:disable-next GraphQL/ExtractType
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
          capture_method: "manual",
          currency: object.total_price.currency,
          description: "#{description} for #{convention.name}",
          statement_descriptor_suffix: SubmitOrderService.statement_descriptor_suffix(convention),
          metadata: {
            order_id: object.id
          }
        },
        stripe_account: convention.stripe_account_id
      )

    intent.client_secret
  end
end
