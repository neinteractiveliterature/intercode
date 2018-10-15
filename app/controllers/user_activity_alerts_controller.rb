class UserActivityAlertsController < ApplicationController
  def index
    authorize! :read, UserActivityAlert.new(convention: convention)
  end
end
