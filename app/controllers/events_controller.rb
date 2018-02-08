class EventsController < ApplicationController
  load_resource through: :convention, except: [:schedule, :schedule_with_counts]
  authorize_resource except: [:schedule, :schedule_with_counts]
  respond_to :html, :json

  # List the available LARPs
  def index
    authorize! :schedule, convention if params[:sort] == 'first_scheduled_run'

    @events = EventListPresenter.new(convention, sort: params[:sort]).sorted_events
    @page_title = 'Event List'
    respond_with @events
  end

  def schedule
    authorize! :schedule, convention
    @page_title = 'Event Schedule'
  end

  def schedule_with_counts
    authorize! :schedule_with_counts, convention
    @page_title = 'Schedule With Counts'
  end

  # Show information about a LARP. The id is specified as part of the URL
  def show
    @runs = @event.runs.includes(:rooms)
    @team_members = @event.team_members.includes(:user).visible.sort_by { |m| m.user.name_inverted }
    respond_with @event
  end

  def edit
  end
end
