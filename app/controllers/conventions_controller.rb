class ConventionsController < ApplicationController
  skip_after_filter :ensure_authorization_performed, only: :index
  
  def index
    @upcoming_cons = []
    @past_cons = []

    @conventions = Convention.all

    @conventions.each do |con|
      if con.ended?
        @past_cons << con
      else
        @upcoming_cons << con
      end
    end
  end
  
  def show
    @convention = Convention.find(params[:id])
    authorize_action_for @convention
  end  
end
