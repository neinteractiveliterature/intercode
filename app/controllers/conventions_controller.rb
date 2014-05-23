class ConventionsController < ApplicationController
  # You should always be able to get a list of conventions
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

  def new
    authorize_action_for ApplicationAuthorizer  #Is this the correct way to do this?
  end

  def create
    authorize_action_for ApplicationAuthorizer
    @convention = Convention.new(convention_params)

    if @convention.save
      flash[:success] = "Convention Created"
      redirect_to 'index'
    else
      render 'new'
    end
  end

  private
  def convention_params
    params.require(:conventions).permit(:name, :domain)
  end

end
