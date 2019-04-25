class TicketsController < ApplicationController
  before_action :authenticate_user!

  skip_authorization_check

  def show
  end
end
