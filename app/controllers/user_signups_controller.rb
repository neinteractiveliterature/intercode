class UserSignupsController < ApplicationController
  load_resource :event, through: :convention
  load_resource :run, through: :event
  respond_to :html, :json

  before_action :authenticate_user!
  skip_authorization_check

  def create
    result = EventSignupService.new(user_con_profile, @run, params[:requested_bucket_key], current_user).call

    if result.failure?
      flash.alert = result.errors.full_messages.join("\n")
    elsif result.signup.confirmed?
      flash.notice = "You have been signed up for #{@event.title}."
    else
      flash.notice = "You have been waitlisted for #{@event.title}."
    end

    redirect_to @event
  end

  def destroy
    signup = @run.signups.where(user_con_profile_id: user_con_profile.id).where.not(state: 'withdrawn').first
    redirect_to @event, alert: "You are not signed up for #{@event.title}." unless signup

    result = EventWithdrawService.new(signup, current_user).call

    if result.failure?
      flash.alert = result.errors.full_messages.join("\n")
    else
      flash.notice = "You have been withdrawn from #{@event.title}."
    end

    redirect_to @event
  end
end
