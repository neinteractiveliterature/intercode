# frozen_string_literal: true
class Mutations::AddOrderEntryToCurrentPendingOrder < Mutations::BaseMutation
  description "Adds an order entry to the current user's pending order, creating one if necessary."

  field :order_entry, Types::OrderEntryType, null: false, description: "The order entry that was added or updated."
  argument :order_entry, Types::OrderEntryInputType, required: true, camelize: false do
    description "The order entry to add."
  end
  argument :pay_what_you_want_amount, Types::MoneyInputType, required: false, camelize: false do
    description "The amount to charge, if this is a pay-what-you-want product."
  end

  require_user_con_profile

  def resolve(order_entry:, pay_what_you_want_amount: nil)
    product = convention.products.find(order_entry.product_id)
    raise GraphQL::ExecutionError, "#{product.name} is not publicly available" unless product.available?

    check_sold_out(product)

    pay_what_you_want_amount = MoneyHelper.coerce_money_input(pay_what_you_want_amount)
    validate_amount(product, pay_what_you_want_amount)

    new_order_entry = upsert_order_entry(product, order_entry, pay_what_you_want_amount)

    { order_entry: new_order_entry }
  end

  private

  def upsert_order_entry(product, order_entry, pay_what_you_want_amount)
    order = current_pending_order || user_con_profile.orders.create!(status: "pending")

    new_order_entry =
      order
        .order_entries
        .find_or_initialize_by(
          product:,
          product_variant_id: order_entry.product_variant_id,
          run_id: order_entry.run_id
        ) { |entry| entry.quantity = 0 }

    new_order_entry.quantity += order_entry.quantity
    if product.pricing_structure.pricing_strategy == "pay_what_you_want"
      new_order_entry.price_per_item = pay_what_you_want_amount
    end
    new_order_entry.save!
    new_order_entry
  end

  def check_sold_out(product)
    return unless product.provides_ticket_type.present? && convention.reached_maximum_tickets?

    raise GraphQL::ExecutionError, "We're sorry, but #{convention.name} is currently sold out."
  end

  def validate_amount(product, pay_what_you_want_amount) # rubocop:disable Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity
    if product.pricing_structure.pricing_strategy == "pay_what_you_want"
      raise GraphQL::ExecutionError, "Amount is required for pay-what-you-want products" unless pay_what_you_want_amount

      value = product.pricing_structure.value
      minimum = value.minimum_amount || Money.new(0, product.convention.default_currency_code_or_site_default)
      raise GraphQL::ExecutionError, "Amount must be at least #{minimum.format}" if pay_what_you_want_amount < minimum

      if value.maximum_amount && pay_what_you_want_amount > value.maximum_amount
        raise GraphQL::ExecutionError,
              "Amount cannot be higher than #{product.pricing_structure.value.maximum_amount.format}"
      end
    elsif pay_what_you_want_amount
      raise GraphQL::ExecutionError, "This is not a pay-what-you-want product; amount cannot be passed"
    end
  end
end
