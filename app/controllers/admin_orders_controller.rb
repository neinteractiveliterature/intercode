class AdminOrdersController < ApplicationController
  def index
    authorize! :read, Order.new(user_con_profile: UserConProfile.new(convention: convention))
  end
end
