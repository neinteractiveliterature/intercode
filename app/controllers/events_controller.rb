class EventsController < ApplicationController
  load_and_authorize_resource through: :convention

  def index
    @page_title = 'Event List'
  end
end
