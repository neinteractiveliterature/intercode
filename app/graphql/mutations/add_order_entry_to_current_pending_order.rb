# frozen_string_literal: true
class Mutations::AddOrderEntryToCurrentPendingOrder < Mutations::BaseMutation
  field :order_entry, Types::OrderEntryType, null: false
  argument :order_entry, Types::OrderEntryInputType, required: true, camelize: false
  argument :pay_what_you_want_amount, Types::MoneyInputType, required: false, camelize: false

  require_user_con_profile

  def resolve(order_entry:, pay_what_you_want_amount: nil)
    product = convention.products.find(order_entry.product_id)
    raise GraphQL::ExecutionError, "#{product.name} is not publicly available" unless product.available?
    validate_amount(product, pay_what_you_want_amount)

    order = current_pending_order
    order ||= user_con_profile.orders.create!(status: 'pending')

    new_order_entry =
      order
        .order_entries
        .find_or_initialize_by(product: product, product_variant_id: order_entry.product_variant_id) do |entry|
          entry.quantity = 0
        end
    new_order_entry.quantity += order_entry.quantity
    new_order_entry.save!

    { order_entry: new_order_entry }
  end

  private

  def validate_amount(product, pay_what_you_want_amount)
    if product.pricing_structure.pricing_strategy == 'pay_what_you_want'
      raise GraphQL::ExecutionError, 'Amount is required for pay-what-you-want products' unless pay_what_you_want_amount

      value = product.pricing_structure.value
      if value.minimum_amount && pay_what_you_want_amount < product.pricing_structure.minimum_amount
        raise GraphQL::ExecutionError, "Amount must be at least #{product.pricing_structure.value.minimum_amount}"
      end

      if value.maximum_amount && pay_what_you_want_amount > product.pricing_structure.maximum_amount
        raise GraphQL::ExecutionError, "Amount cannot be higher than #{product.pricing_structure.value.maximum_amount}"
      end
    elsif pay_what_you_want_amount
      raise GraphQL::ExecutionError, 'This is not a pay-what-you-want product; amount cannot be passed'
    end
  end
end
