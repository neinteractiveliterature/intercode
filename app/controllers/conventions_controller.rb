class ConventionsController < ApplicationController
  # call #convention first just so that load_and_authorize_resource won't try it if we're in a
  # virtual host
  before_action :convention
  load_and_authorize_resource

  def edit
  end
end
