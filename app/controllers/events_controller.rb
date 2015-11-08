class EventsController < BaseControllers::VirtualHost
  load_and_authorize_resource through: :convention

  # Display form to propose a new LARP.  Create a new LARP event to initialize
  # the form
  def new
  end

  # Write information from the new LARP to the database
  def create
    @larp.convention = convention
    @larp.user = current_user
    @larp.updated_by = current_user
    if @larp.save
      flash[:notice]="Thank you for submitting your LARP"
      redirect_to event_path(@larp)
    else
      render 'new'
    end
  end

  # Edit information about a LARP. The id is specified as part of the URL
  def edit
  end

  # Update information about a LARP to the database
  def update
    @event.updated_by = current_user

    if @event.update_attributes(event_params)
      redirect_to action: 'show'
    else
      render 'edit'
    end
  end

  # List the available LARPs
  def index
    @events = @events.accepted.order(:title)
  end

  def schedule
    @events = @events.accepted.includes(runs: :rooms)
    runs = @events.flat_map(&:runs).sort_by(&:starts_at)

    start_date = runs.first.starts_at.to_date
    end_date = runs.last.ends_at.to_date

    @dates = (start_date..end_date).to_a
    @runs_by_date = runs.group_by { |run| run.starts_at.to_date }
  end

  # Show information about a LARP. The id is specified as part of the URL
  def show
    @runs = @event.runs.includes(:rooms)
    @team_members = @event.team_members.includes(:user).visible.sort_by { |m| m.user.name_inverted }
  end

  # Permit access to fields that can be updated
  def event_params
    params.require(:event).permit(:author,
                                  :description,
                                  :email,
                                  :length_seconds,
                                  :organization,
                                  :short_blurb,
                                  :title,
                                  :url)
  end
end
