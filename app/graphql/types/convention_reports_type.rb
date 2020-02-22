class Types::ConventionReportsType < Types::BaseObject
  # WARNING WARNING
  # Do not use `convention` in here!  Use `object` instead.  `convention` will appear to work but
  # is subtly wrong, because the current domain's convention might not be the convention the user
  # is asking for in their query.

  field :ticket_count_by_type_and_payment_amount, [Types::TicketCountByTypeAndPaymentAmountType],
    null: false
  field :total_revenue, Types::MoneyType, null: false
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

  def event_provided_tickets
    tickets = object.tickets.joins(:provided_by_event)
      .where(events: { status: 'active' })
      .includes(:provided_by_event)
    tickets.to_a.group_by(&:provided_by_event).map do |provided_by_event, event_tickets|
      {
        provided_by_event: provided_by_event,
        tickets: event_tickets
      }
    end
  end

  def events_by_choice
    rows = ActiveRecord::Base.connection.select_rows <<~SQL
      SELECT event_id, state, choice, count(*) FROM (
        SELECT
          runs.event_id,
          signups.state,
          signups.user_con_profile_id,
          row_number() OVER (
            PARTITION BY signups.user_con_profile_id
            ORDER BY signups.created_at
          ) AS choice
        FROM signups
        INNER JOIN runs ON runs.id = signups.run_id
        INNER JOIN events ON events.id = runs.event_id
        LEFT JOIN team_members ON (
          team_members.event_id = events.id
          AND team_members.user_con_profile_id = signups.user_con_profile_id
        )
        WHERE
          events.convention_id = #{object.id}
          AND signups.counted = 't'
          AND team_members.id IS NULL
          AND events.status = 'active'
      ) ranked_signups
      GROUP BY event_id, state, choice
    SQL
    rows_by_event_id = rows.group_by { |(event_id, _, _, _)| event_id }

    object.events.active.map do |event|
      {
        event: event,
        choice_counts: (rows_by_event_id[event.id] || []).map do |(_, state, choice, count)|
          { choice: choice, state: state, count: count }
        end
      }
    end
  end
end
