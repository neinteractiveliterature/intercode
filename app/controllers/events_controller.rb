class EventsController < BaseControllers::VirtualHost
  load_and_authorize_resource through: :convention
  respond_to :html, :json

  # List the available LARPs
  def index
    @events = @events.active.order(:title)
    respond_with @events
  end

  def schedule
    @page_title = "Event Schedule"
  end

  def schedule_with_counts
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
end
