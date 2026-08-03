# frozen_string_literal: true
# The result of a signup being automatically moved from one state or bucket to another
class SignupMoveResultDrop < Liquid::Drop
  # @api
  attr_reader :signup_move_result

  # @!method signup
  #   @return [SignupDrop] The signup that was moved
  # @!method state
  #   @return [String] The new state of this signup (e.g. confirmed, waitlisted, withdrawn)
  # @!method bucket
  #   @return [RegistrationPolicy::BucketDrop] The new bucket assigned to this signup, or nil if
  #     that bucket has since been deleted
  # @!method bucket_name
  #   @return [String] The name of the new bucket assigned to this signup, even if that bucket has
  #     since been deleted
  # @!method prev_state
  #   @return [String] The previous state of this signup (e.g. confirmed, waitlisted, withdrawn)
  # @!method prev_bucket
  #   @return [RegistrationPolicy::BucketDrop] The previous bucket assigned to this signup, or nil if
  #     that bucket has since been deleted
  # @!method prev_bucket_name
  #   @return [String] The name of the previous bucket assigned to this signup, even if that bucket
  #     has since been deleted
  delegate :signup, :state, :bucket, :bucket_name, :prev_state, :prev_bucket, :prev_bucket_name, to: :signup_move_result

  # @api
  def initialize(signup_move_result)
    @signup_move_result = signup_move_result
  end
end
