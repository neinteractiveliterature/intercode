class ConventionReportsPresenter
  class OrganizationAttendanceCount
    attr_reader :user_id, :current_convention_user_con_profile, :user_con_profile_ids, :attended_convention_ids

    def initialize(user_id:, current_convention_user_con_profile:, user_con_profile_ids:, attended_convention_ids:)
      @user_id = user_id
      @current_convention_user_con_profile = current_convention_user_con_profile
      @user_con_profile_ids = user_con_profile_ids
      @attended_convention_ids = attended_convention_ids
    end
  end

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
              "COALESCE(price_per_item_currency, #{ActiveRecord::Base.connection.quote(convention.default_currency_code_or_site_default)})"
            )
            .where.not(product_id: nil)
            .pluck(
              :product_id,
              :status,
              Arel.sql("COALESCE(price_per_item_cents, 0)"),
              Arel.sql(
                "COALESCE(price_per_item_currency, #{ActiveRecord::Base.connection.quote(convention.default_currency_code_or_site_default)})"
              ),
              Arel.sql("COALESCE(SUM(quantity), 0) sum_quantity")
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
              "COALESCE(price_per_item_currency, #{ActiveRecord::Base.connection.quote(convention.default_currency_code_or_site_default)})"
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

  def new_and_returning_attendees # rubocop:disable Metrics/MethodLength
    current_profiles = convention.user_con_profiles.joins(:ticket).includes(:staff_positions, :team_members).distinct

    return { organization_attendance_counts: [] } unless convention.organization_id

    current_profiles_by_user_id = current_profiles.index_by(&:user_id)

    org_attendance_counts =
      UserConProfile
        .joins(:ticket)
        .joins("INNER JOIN conventions AS org_conventions ON org_conventions.id = user_con_profiles.convention_id")
        .where(user_id: current_profiles_by_user_id.keys)
        .where(org_conventions: { organization_id: convention.organization_id })
        .group(:user_id)
        .select(
          :user_id,
          "array_agg(DISTINCT user_con_profiles.id) user_con_profile_ids",
          "array_agg(DISTINCT org_conventions.id) attended_convention_ids"
        )

    {
      organization_attendance_counts:
        org_attendance_counts.map do |org_attendance_count|
          OrganizationAttendanceCount.new(
            user_id: org_attendance_count.user_id,
            current_convention_user_con_profile: current_profiles_by_user_id[org_attendance_count.user_id],
            user_con_profile_ids: org_attendance_count.user_con_profile_ids,
            attended_convention_ids: org_attendance_count.attended_convention_ids
          )
        end
    }
  end

  def events_by_choice
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
