class ConventionsController < ApplicationController
  # You should always be able to get a list of conventions
  skip_authorization_check
  
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
  
  def new
    @convention = Convention.new
  end
  
  # Write the new convention to the database
  def create
    @convention = Convention.new(convention_params)
    if @convention.save
      redirect_to conventions_url
    else
      render 'new'
    end
  end
  
  def show
    @convention = Convention.find(params[:id])
    authorize_action_for @convention
  end  
  
  private
  def convention_params
    params.require(:convention).permit(:name, :domain)
  end
end
