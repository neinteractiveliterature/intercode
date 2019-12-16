class EventSignupMailer < ApplicationMailer
  def new_signup(signup)
    notification_mail(Signups::NewSignupNotifier.new(signup: signup))
  end

  def withdrawal(signup, prev_state, prev_bucket_key, move_results)
    move_results = move_results.map do |move_result|
      move_result.is_a?(Hash) ? SignupMoveResult.from_h(move_result) : move_result
    end

    notification_mail(
      Signups::WithdrawalNotifier.new(
        signup: signup, prev_state: prev_state,
        prev_bucket_key: prev_bucket_key, move_results: move_results
      )
    )
  end

  def registration_policy_change_moved_signups(event, move_results, whodunit)
    move_results = move_results.map { |hash| SignupMoveResult.from_h(hash) }

    notification_mail(
      Signups::RegistrationPolicyChangeMovedSignupsNotifier.new(
        event: event, move_results: move_results, whodunit: whodunit
      )
    )
  end

  def user_signup_moved(move_result)
    move_result = SignupMoveResult.from_h(move_result) if move_result.is_a?(Hash)

    notification_mail(Signups::UserSignupMovedNotifier.new(move_result: move_result))
  end
end
