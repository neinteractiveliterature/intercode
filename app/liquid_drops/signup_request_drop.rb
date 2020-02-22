# A request to sign up for a run of an event
class SignupRequestDrop < Liquid::Drop
  # @api
  attr_reader :signup_request

  # @!method id
  #   @return [Integer] The numeric database id of this signup request
  # @!method target_run
  #   @return [RunDrop] The run the signup is requested for
  # @!method user_con_profile
  #   @return [UserConProfileDrop] The profile of the person who made the request
  # @!method state
  #   @return [String] The state of this signup request (e.g. pending, accepted, rejected,
  #                    withdrawn)
  # @!method result_signup
  #   @return [SignupDrop] The resulting signup, if the request was accepted
  delegate :id, :target_run, :user_con_profile, :state, :result_signup, to: :signup_request

  # @!method event
  #   @return [EventDrop] The event the signup is requested for
  delegate :event, to: :target_run

  # @api
  def initialize(signup_request)
    @signup_request = signup_request
  end

  # @return [String] The relative URL of the event's page on the convention site
  def event_url
    "/events/#{event.to_param}"
  end

  # @return [String] The URL for admins to go to moderate this signup request
  def signup_moderation_url
    '/signup_moderation'
  end

  # @!method requested_bucket
  #   @return [RegistrationPolicy::BucketDrop] The bucket the user requested to sign up in, if any
  def requested_bucket
    return nil unless signup_request.requested_bucket_key
    event.registration_policy.bucket_with_key(signup_request.requested_bucket_key)
  end
end
