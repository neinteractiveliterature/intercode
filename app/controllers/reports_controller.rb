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

  private
  def ensure_authorized
    authorize! :view_reports, convention
  end
end
