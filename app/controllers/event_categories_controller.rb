class EventCategoriesController < ApplicationController
  def index
    authorize! :update, EventCategory.new(convention: convention)
  end
end
