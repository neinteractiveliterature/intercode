class TicketTypesController < ApplicationController
  load_and_authorize_resource through: :convention

  def index
  end
end
