class EventSignups::WithdrawalNotifier < Notifier
  include EventSignups::SignupNotificationsHelper

  attr_reader :signup, :prev_state, :prev_bucket_key, :move_results

  def initialize(signup:, prev_state:, prev_bucket_key:, move_results:)
    @signup = signup
    @prev_state = prev_state
    @prev_bucket_key = prev_bucket_key
    @move_results = move_results
    super(convention: signup.run.event.convention, event_key: 'signups/withdrawal')
  end

  def liquid_assigns
    super.merge(
      'signup' => signup,
      'prev_state' => prev_state,
      'prev_bucket' => prev_bucket,
      'move_results' => move_results
    )
  end

  def destinations
    team_members_to_notify_for_signup(signup).map(&:user_con_profile)
  end

  def prev_bucket
    return unless prev_bucket_key
    signup.run.event.registration_policy.bucket_with_key(prev_bucket_key)
  end
end
