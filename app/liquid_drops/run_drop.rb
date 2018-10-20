# A run of an event
class RunDrop < Liquid::Drop
  include Rails.application.routes.url_helpers

  # @api
  attr_reader :run

  # @!method id
  #   @return [Integer] The numeric database ID of this run
  # @!method event
  #   @return [EventDrop] The event this is a run of
  # @!method starts_at
  #   @return [ActiveSupport::TimeWithZone] The time at which this run starts
  # @!method ends_at
  #   @return [ActiveSupport::TimeWithZone] The time at which this run ends
  # @!method length_seconds
  #   @return [Integer] The length of this run in seconds
  delegate :id, :event, :starts_at, :ends_at, :length_seconds, to: :run

  # @api
  def initialize(run)
    @run = run
  end

  # @return [String] The relative URL to use for linking to the event's page on the convention site
  def event_url
    event_path(run.event)
  end

  # @return [String] The URL to use for signing up for this event (using a POST request)
  def signup_url
    event_run_user_signup_path(event, run)
  end

  # @return [String] The URL to use for withdrawing from event (using a DELETE request)
  def withdraw_url
    event_run_user_signup_path(event, run)
  end
end
