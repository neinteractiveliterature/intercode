class SignupDrop < Liquid::Drop
  include Rails.application.routes.url_helpers

  attr_reader :signup
  delegate :run, :user_con_profile, :state, :bucket, :team_member?, to: :signup
  delegate :event, :starts_at, :ends_at, :length_seconds, to: :run

  def initialize(signup)
    @signup = signup
  end

  def event_url
    event_path(run.event)
  end

  def withdraw_url
    event_run_user_signup_path(event, run)
  end
end