# frozen_string_literal: true
class Types::ConventionReportsType < Types::BaseObject
  description "Reports that can be queried against a convention."

  # WARNING WARNING
  # Do not use `convention` in here!  Use `object` instead.  `convention` will appear to work but
  # is subtly wrong, because the current domain's convention might not be the convention the user
  # is asking for in their query.

  field :event_provided_tickets, [Types::EventProvidedTicketListType], null: false do
    description "A report of all tickets provided by events at this convention."
  end
  field :events_by_choice, [Types::EventWithChoiceCountsType], null: false do
    description "A report of events people signed up for along with which numbered choice they were for that person."
  end
  field :sales_count_by_product_and_payment_amount, [Types::SalesCountByProductAndPaymentAmountType], null: false do
    description "A breakdown of all product and ticket sales in this convention."
  end
  field :sum_revenue, Types::MoneyType, null: false do
    description "The total revenue taken in by this convention, optionally filtered by various parameters."

    argument :order_statuses, [Types::OrderStatusType], required: false do
      description "If specified, only counts revenue from orders with these statuses."
    end
    argument :product_ids, [ID], required: false, description: "If specified, only counts revenue from these products."
  end
  field :ticket_count_by_type_and_payment_amount, # rubocop:disable GraphQL/FieldDescription
        [Types::TicketCountByTypeAndPaymentAmountType],
        null: false,
        deprecation_reason:
          "This only takes ticket sales into account.  Please use the sales_count_by_product_and_payment_amount field \
instead."
  field :total_revenue, # rubocop:disable GraphQL/FieldDescription
        Types::MoneyType,
        null: false,
        deprecation_reason: "This only takes ticket sales into account.  Please use the sum_revenue field instead."

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
