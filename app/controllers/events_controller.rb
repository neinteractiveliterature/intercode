class EventsController < ApplicationController
  load_and_authorize_resource through: :convention

  def index
    @page_title = 'Event List'
  end

  def show
    render action: 'index'
  end

  private

  def liquid_assigns
    super.merge('event' => @event)
  end
end
