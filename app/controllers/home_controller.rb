class HomeController < ApplicationController

  skip_after_filter :ensure_authorization_performed

  def index
    @users = User.all
  end
end
