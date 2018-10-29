# A signup for a run of an event
class SignupDrop < Liquid::Drop
  include Rails.application.routes.url_helpers

  # @api
  attr_reader :signup

  # @!method id
  #   @return [Integer] The numeric database id of this signup
  # @!method run
  #   @return [RunDrop] The run the signup is for
  # @!method user_con_profile
  #   @return [UserConProfileDrop] The profile of the person who is signed up
  # @!method state
  #   @return [String] The state of this signup (e.g. confirmed, waitlisted, withdrawn)
  # @!method bucket
  #   @return [RegistrationPolicy::BucketDrop] The bucket assigned to this signup
  delegate :id, :run, :user_con_profile, :state, :bucket, :team_member?, to: :signup

  # @return [Boolean] Whether or not this signup is for an event team member
  alias team_member team_member?

  # @!method event
  #   @return [EventDrop] The event the signup is for
  # @!method starts_at
  #   @return [ActiveSupport::TimeWithZone] When the run starts
  # @!method ends_at
  #   @return [ActiveSupport::TimeWithZone] When the run ends
  # @!method length_seconds
  #   @return [Integer] The length of the run in seconds
  delegate :event, :starts_at, :ends_at, :length_seconds, to: :run

  # @api
  def initialize(signup)
    @signup = signup
  end

  # @return [String] The relative URL of the event's page on the convention site
  def event_url
    event_path(run.event)
  end

  # @return [String] The URL to use for withdrawing from the event (using a DELETE request)
  def withdraw_url
    event_run_user_signup_path(event, run)
  end
end
