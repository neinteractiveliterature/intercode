class EventsController < ApplicationController
  load_and_authorize_resource through: :convention
  respond_to :html, :json

  # List the available LARPs
  def index
    @events = Event.title_sort(@events.active)
    @page_title = "Event List"
    respond_with @events
  end

  def schedule
    authorize! :schedule, convention
    @page_title = "Event Schedule"
  end

  def schedule_with_counts
    authorize! :schedule_with_counts, convention
    @page_title = "Schedule With Counts"
  end

  # Show information about a LARP. The id is specified as part of the URL
  def show
    @runs = @event.runs.includes(:rooms)
    @team_members = @event.team_members.includes(:user).visible.sort_by { |m| m.user.name_inverted }
    @user_signup_by_run_id = if user_con_profile
      Signup.where(
        user_con_profile_id: user_con_profile.id,
        run_id: @runs.map(&:id),
        state: ['confirmed', 'waitlisted']
      ).to_a.index_by(&:run_id)
    else
      {}
    end

    respond_with @event
  end

  def edit
  end
end
