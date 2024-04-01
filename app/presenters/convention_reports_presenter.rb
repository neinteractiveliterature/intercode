class ConventionReportsPresenter
  attr_reader :convention

  def initialize(convention)
    @convention = convention
  end

  # rubocop:disable Metrics/MethodLength
  def sales_count_by_product_and_payment_amount
    @sales_count_by_product_and_payment_amount ||=
      begin
        grouped_count_data =
          convention
            .orders
            .completed
            .left_joins(:order_entries)
            .group(
              :product_id,
              :status,
              "COALESCE(price_per_item_cents, 0)",
              "COALESCE(price_per_item_currency, #{ActiveRecord::Base.quote(convention.default_currency_code_or_site_default)})"
            )
            .pluck(
              :product_id,
              :status,
              Arel.sql("COALESCE(price_per_item_cents, 0)"),
              Arel.sql(
                "COALESCE(price_per_item_currency, #{ActiveRecord::Base.quote(convention.default_currency_code_or_site_default)})"
              ),
              Arel.sql("SUM(quantity) sum_quantity")
            )

        grouped_count_data.map do |product_id, status, amount_cents, amount_currency, sum_quantity|
          {
            product_id: product_id,
            status: status,
            payment_amount: Money.new(amount_cents, amount_currency),
            count: sum_quantity
          }
        end
      end
  end
  # rubocop:enable Metrics/MethodLength

  def ticket_count_by_type_and_payment_amount
    @ticket_count_by_type_and_payment_amount ||=
      begin
        grouped_count_data =
          convention
            .tickets
            .left_joins(:order_entry)
            .group(
              :ticket_type_id,
              "COALESCE(price_per_item_cents, 0)",
              "COALESCE(price_per_item_currency, #{ActiveRecord::Base.quote(convention.default_currency_code_or_site_default)})"
            )
            .count

        grouped_count_data.map do |(ticket_type_id, amount_cents, amount_currency), count|
          { ticket_type_id: ticket_type_id, payment_amount: Money.new(amount_cents, amount_currency), count: count }
        end
      end
  end

  def sum_revenue(product_ids: nil, order_statuses: nil)
    sales_count_rows =
      sales_count_by_product_and_payment_amount.filter do |row|
        next false if product_ids.present? && product_ids.exclude?(row[:product_id])
        next false if order_statuses.present? && order_statuses.exclude?(row[:status])
        true
      end
    return Money.new(0, convention.default_currency_code_or_site_default) if sales_count_rows.empty?
    sales_count_rows.sum { |row| row[:payment_amount] * row[:count] }
  end

  def event_provided_tickets
    tickets =
      convention.tickets.joins(:provided_by_event).where(events: { status: "active" }).includes(:provided_by_event)
    tickets
      .to_a
      .group_by(&:provided_by_event)
      .map { |provided_by_event, event_tickets| { provided_by_event: provided_by_event, tickets: event_tickets } }
  end

  def events_by_choice # rubocop:disable Metrics/MethodLength
    rows = ActiveRecord::Base.connection.select_rows <<~SQL.squish
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
          events.convention_id = #{convention.id}
          AND signups.counted = 't'
          AND team_members.id IS NULL
          AND events.status = 'active'
      ) ranked_signups
      GROUP BY event_id, state, choice
    SQL
    rows_by_event_id = rows.group_by { |(event_id, _, _, _)| event_id }

    convention.events.active.map do |event|
      {
        event: event,
        choice_counts:
          (rows_by_event_id[event.id] || []).map do |(_, state, choice, count)|
            { choice: choice, state: state, count: count }
          end
      }
    end
  end
end
