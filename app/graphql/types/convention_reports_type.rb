# frozen_string_literal: true
class Types::ConventionReportsType < Types::BaseObject
  # WARNING WARNING
  # Do not use `convention` in here!  Use `object` instead.  `convention` will appear to work but
  # is subtly wrong, because the current domain's convention might not be the convention the user
  # is asking for in their query.

  field :sales_count_by_product_and_payment_amount, [Types::SalesCountByProductAndPaymentAmountType], null: false
  field :ticket_count_by_type_and_payment_amount,
        [Types::TicketCountByTypeAndPaymentAmountType],
        null: false,
        deprecation_reason:
          "This only takes ticket sales into account.  Please use the sales_count_by_product_and_payment_amount field \
instead."
  field :total_revenue,
        Types::MoneyType,
        null: false,
        deprecation_reason: "This only takes ticket sales into account.  Please use the sum_revenue field instead."
  field :sum_revenue, Types::MoneyType, null: false do
    argument :product_ids, [ID], required: false
    argument :order_statuses, [Types::OrderStatusType], required: false
  end
  field :event_provided_tickets, [Types::EventProvidedTicketListType], null: false
  field :events_by_choice, [Types::EventWithChoiceCountsType], null: false

  # If you really want the convention from context, use this
  def context_convention
    context[:convention]
  end

  def convention
    raise "Do not call the #convention method in ConventionReportsType.  \
Use #object or #context_convention instead."
  end

  # Deprecated and misleading: this is only total _ticket sales_ revenue.
  def total_revenue
    if object.ticket_count_by_type_and_payment_amount.blank?
      return Money.new(0, object.default_currency_code_or_site_default)
    end
    object.ticket_count_by_type_and_payment_amount.sum { |row| row[:payment_amount] * row[:count] }
  end
end
