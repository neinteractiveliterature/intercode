class ConventionsController < ApplicationController
  before_action :try_virtual_host
  load_and_authorize_resource

  def index
    @upcoming_cons = []
    @past_cons = []

    @conventions.each do |con|
      if con.ended?
        @past_cons << con
      else
        @upcoming_cons << con
      end
    end
  end

  def new
  end

  # Write the new convention to the database
  def create
    if @convention.save
      redirect_to conventions_url
    else
      render 'new'
    end
  end

  def edit
  end

  def show
    respond_to do |format|
      format.json { render json: @convention }
    end
  end

  def update
    if @convention.save
      redirect_to conventions_url
    else
      render 'edit'
    end
  end

  def destroy
    @convention.destroy!
    redirect_to conventions_url
  end

  private
  def try_virtual_host
    if request.env["intercode.convention"]
      @convention = request.env["intercode.convention"]
    end
  end

  def convention_params
    params.require(:convention).permit(:name, :domain, :timezone_name)
  end
end
