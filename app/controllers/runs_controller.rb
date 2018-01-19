class RunsController < ApplicationController
  load_resource :event, through: :convention
  load_and_authorize_resource through: :event

  def signup_summary
    signups = @run.signups.where(state: %w(confirmed waitlisted)).
      includes(:user_con_profile)

    @confirmed_signups, @waitlisted_signups = signups.partition(&:confirmed?)
    @confirmed_signups.sort_by! { |signup| [signup.user_con_profile.last_name, signup.user_con_profile.first_name] }
    @waitlisted_signups.sort_by!(&:created_at)
  end
end
