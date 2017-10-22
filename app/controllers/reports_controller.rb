class ReportsController < ApplicationController
  before_action :ensure_authorized

  layout 'reports'

  def per_event
    @events = Event.title_sort(
      convention.events.where.not(category: %w(volunteer_event filler)).active.includes(
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

  private
  def ensure_authorized
    authorize! :view_reports, convention
  end
end
