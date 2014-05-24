class ConventionsController < ApplicationController
  # You should always be able to get a list of conventions
  skip_after_filter :ensure_authorization_performed, only: :index
  
  def index
    @convention_timeline = ConventionTimeline.new(Convention.all)
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
      redirect_to conventions_path
    else
      render 'new'
    end
  end

  def edit
    @convention = Convention.find(params[:id])
    authorize_action_for @convention
  end

  def duplicate
    authorize_action_for ApplicationAuthorizer



  end

  class ConventionTimeline
    attr_accessor :past_conventions, :current_conventions, :upcoming_conventions, :unspecified_dates

    def initialize( conventions )
      @past_conventions = []
      @current_conventions = []
      @upcoming_conventions = []
      @unspecified_dates = []

      conventions.each do |con|
        if con.ended?
          @past_conventions << con
        elsif con.current?
          @current_conventions << con
        elsif con.upcoming?
          @upcoming_conventions << con
        else con.unspecified?
          @unspecified_dates << con
        end
      end

    end
  end

  private
  def convention_params
    params.require(:conventions).permit(:name, :domain, :starts_at, :ends_at)
  end

end
