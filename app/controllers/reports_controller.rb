class ReportsController < ApplicationController
  before_action :ensure_authorized

  layout 'reports', except: 'index'
  layout 'application', only: 'index'

  def index
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

  def events_by_time
    @runs = convention.runs.where(
      event_id: convention.events.where.not(category: 'filler').active.select(:id)
    ).order(:starts_at).includes(:event, :rooms)
  end

  private
  def ensure_authorized
    authorize! :view_reports, convention
  end
end
