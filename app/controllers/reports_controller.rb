class ReportsController < ApplicationController
  include Concerns::SendCsv

  before_action :ensure_authorized

  layout 'print_reports', only: %w[
    events_by_time per_event per_user per_room single_user_printable volunteer_events
  ]

  def index
  end

  def export_signup_spy
    respond_to do |format|
      format.csv do
        send_table_presenter_csv(
          Tables::SignupsTableResultsPresenter.signup_spy_for_convention(convention),
          [convention.name, 'Signups', Date.today.iso8601].compact.join(' - ')
        )
      end
    end
  end

  def events_by_time
    @runs = convention.runs.where(
      event_id: convention.events.joins(:event_category).where.not(event_categories: { name: 'Filler event' }).active.select(:id)
    ).order(:starts_at).includes(:event, :rooms)
  end

  def per_event
    @events = Event.title_sort(
      convention.events.regular.active
        .where.not(event_category_id: volunteer_event_category_ids)
        .includes(
          :event_category,
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

  def single_user_printable
    @subject_profile = convention.user_con_profiles.includes(
      signups: [:event, run: :rooms]
    ).find(params[:user_con_profile_id])

    @events = Event.title_sort(
      Event.where(id: TeamMember.where(user_con_profile_id: @subject_profile.id).select(:event_id))
        .where.not(event_category_id: volunteer_event_category_ids)
        .active
        .includes(
          :event_category,
          team_members: :user_con_profile,
          runs: [:rooms, signups: :user_con_profile]
        )
    )
  end

  def volunteer_events
    @events = Event.title_sort(
      convention.events.where(event_category_id: volunteer_event_category_ids).active.includes(
        runs: [signups: :user_con_profile]
      )
    )
  end

  private

  def ensure_authorized
    authorize convention, :view_reports?
  end

  def volunteer_event_category_ids
    @volunteer_event_category_ids ||= convention.event_categories.where("name ilike '%volunteer%'").pluck(:id)
  end
end
