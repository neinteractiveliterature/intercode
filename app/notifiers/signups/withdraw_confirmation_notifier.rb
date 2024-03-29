# frozen_string_literal: true
class Signups::WithdrawConfirmationNotifier < Notifier
  include Signups::SignupNotificationsHelper

  attr_reader :signup, :prev_state, :prev_bucket_key, :move_results

  def initialize(signup:, prev_state:, prev_bucket_key:)
    @signup = signup
    @prev_state = prev_state
    @prev_bucket_key = prev_bucket_key
    super(convention: signup.run.event.convention, event_key: "signups/withdraw_confirmation")
  end

  def liquid_assigns
    super.merge("signup" => signup, "prev_state" => prev_state, "prev_bucket" => prev_bucket)
  end

  def destinations
    [signup.user_con_profile]
  end

  def prev_bucket
    return unless prev_bucket_key
    signup.run.event.registration_policy.bucket_with_key(prev_bucket_key)
  end
end
