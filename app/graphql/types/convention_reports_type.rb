class Types::ConventionReportsType < Types::BaseObject
  # WARNING WARNING
  # Do not use `convention` in here!  Use `object` instead.  `convention` will appear to work but
  # is subtly wrong, because the current domain's convention might not be the convention the user
  # is asking for in their query.

  field :ticket_count_by_type_and_payment_amount, [Types::TicketCountByTypeAndPaymentAmountType],
    null: false
  field :total_revenue, Types::MoneyType, null: false

  def ticket_count_by_type_and_payment_amount
    @ticket_count_by_type_and_payment_amount ||= begin
      grouped_count_data = object.tickets.group(
        :ticket_type_id,
        'COALESCE(payment_amount_cents, 0)',
        "COALESCE(payment_amount_currency, 'USD')"
      ).count

      grouped_count_data.map do |(ticket_type_id, amount_cents, amount_currency), count|
        {
          ticket_type_id: ticket_type_id,
          payment_amount: Money.new(amount_cents, amount_currency),
          count: count
        }
      end
    end
  end

  def total_revenue
    return Money.new(0, 'USD') if ticket_count_by_type_and_payment_amount.blank?
    ticket_count_by_type_and_payment_amount.map do |row|
      row[:payment_amount] * row[:count]
    end.sum
  end
end
