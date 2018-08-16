class RunsController < ApplicationController
  load_resource :event, through: :convention
  load_and_authorize_resource through: :event

  def signup_summary
  end
end
