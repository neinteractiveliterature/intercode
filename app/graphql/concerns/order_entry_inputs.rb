# frozen_string_literal: true
module OrderEntryInputs
  def process_order_entry_input(input, order_entry)
    order_entry_fields =
      process_transitional_ids_in_input(input.to_h.symbolize_keys, :product_id, :product_variant_id, :ticket_id)
    order_entry_fields.delete(:ticket_id)

    if order_entry_fields[:price_per_item]
      if policy(order_entry).change_price?
        order_entry_fields[:price_per_item] = MoneyHelper.coerce_money_input(order_entry_fields[:price_per_item])
      else
        order_entry_fields.delete(:price_per_item)
      end
    end

    order_entry_fields
  end
end
