class ReportsController < ApplicationController
  before_action :ensure_authorized

  layout 'print_reports', only: ['events_by_time', 'per_event', 'per_user', 'per_room', 'volunteer_events']

  def index
  end

  def attendance_by_payment_amount
    raw_data = convention.tickets.group(
      :ticket_type_id,
      :payment_amount_cents,
      :payment_amount_currency
    ).count

    ticket_types_by_id = convention.ticket_types.find(raw_data.keys.map(&:first)).index_by(&:id)
    @count_by_ticket_type_and_payment_amount = raw_data.transform_keys do |(ticket_type_id, cents, currency)|
      [ticket_types_by_id[ticket_type_id], Money.new(cents, currency)]
    end
  end

  def event_provided_tickets
    @tickets = convention.tickets.where.not(provided_by_event_id: nil).includes(
      :provided_by_event,
      :ticket_type,
      :user_con_profile
    )

    @tickets_by_event_id = @tickets.to_a.group_by(&:provided_by_event_id)
    @events = Event.title_sort(convention.events.regular.active)
  end

  def events_by_time
    @runs = convention.runs.where(
      event_id: convention.events.where.not(category: 'filler').active.select(:id)
    ).order(:starts_at).includes(:event, :rooms)
  end

  def per_event
    @events = Event.title_sort(
      convention.events.regular.active.includes(
        team_members: :user_con_profile,
        runs: [:rooms, signups: :user_con_profile]
      )
    )
  end

  def per_user
    @user_con_profiles = convention.user_con_profiles.joins(:ticket).includes(
      signups: [:event, run: :rooms]
    ).sort_by { |ucp| ucp.name_inverted.downcase }
  end

  def per_room
    @rooms = convention.rooms.includes(
      runs: [:event, :rooms]
    ).sort_by { |room| room.name.downcase }
  end

  def volunteer_events
    @events = Event.title_sort(
      convention.events.where(category: 'volunteer_event').active.includes(
        runs: [signups: :user_con_profile]
      )
    )
  end

  private
  def ensure_authorized
    authorize! :view_reports, convention
  end
end
