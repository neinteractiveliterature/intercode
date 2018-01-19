class RunDrop < Liquid::Drop
  include Rails.application.routes.url_helpers

  attr_reader :run
  delegate :id, :event, :starts_at, :ends_at, :length_seconds, to: :run

  def initialize(run)
    @run = run
  end

  def event_url
    event_path(run.event)
  end

  def signup_url
    event_run_user_signup_path(event, run)
  end

  def withdraw_url
    event_run_user_signup_path(event, run)
  end
end
