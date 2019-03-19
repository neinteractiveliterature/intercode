class UsersController < ApplicationController
  def index
    authorize! :read, User
  end
end
