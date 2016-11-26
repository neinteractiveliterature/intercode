class EventSignupMailer < ApplicationMailer
  def new_signup(signup, team_member)
    @signup = signup
    @signup_count_presenter = SignupCountPresenter.new(signup.run)

    mail(
      to: team_member.user_con_profile.email,
      subject: "#{subject_prefix(signup)} Signup: #{signup.user_con_profile.name}"
    )
  end

  def withdrawal(signup, move_results, team_member)
    @signup = signup
    @move_results = move_results
    @signup_count_presenter = SignupCountPresenter.new(signup.run)

    mail(
      to: team_member.user_con_profile.email,
      subject: "#{subject_prefix(signup)} Withdrawal: #{signup.user_con_profile.name}"
    )
  end

  def user_signup_moved(move_result)
    @move_result = move_result
    @move_result = EventWithdrawService::SignupMoveResult.from_h(@move_result) if @move_result.is_a?(Hash)
    @signup = @move_result.signup

    mail(
      to: @signup.user_con_profile.email,
      subject: "#{subject_prefix(@signup)} Signup moved"
    )
  end

  private

  def subject_prefix(signup)
    "[#{signup.event.convention.name}: #{signup.event.title}]"
  end
end
