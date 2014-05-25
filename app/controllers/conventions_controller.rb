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
    authorize_action_for ApplicationAuthorizer #Is this the correct way to do this?
    @convention = Convention.new
  end

  def create
    authorize_action_for ApplicationAuthorizer
    @convention = Convention.new(convention_params)

    if @convention.save
      redirect_to conventions_path, :flash => { :success => 'Convention created!' }
    else
      render 'new'
    end
  end

  def edit
    @convention = Convention.find(params[:id])
    authorize_action_for @convention
  end

  def update
    @convention = Convention.find(params[:id])
    authorize_action_for @convention

    if @convention.update(convention_params)
      redirect_to conventions_path, :flash => { :success => 'Convention updated!' }
    else
      render 'edit'
    end

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
    params.require(:convention).permit(:title, :domain, :start_date, :end_date)
  end

end
