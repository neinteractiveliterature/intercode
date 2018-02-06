class EventSignupMailer < ApplicationMailer
  def new_signup(signup, team_member)
    @signup = signup
    @signup_count_presenter = SignupCountPresenter.new(signup.run)

    mail(
      to: team_member.user_con_profile.email,
      subject: "#{subject_prefix(signup)} Signup: #{signup.user_con_profile.name}"
    )
  end

  def withdrawal(signup, prev_state, prev_bucket_key, move_results, team_member)
    @signup = signup
    @prev_state = prev_state
    if prev_bucket_key
      @prev_bucket = signup.event.registration_policy.bucket_with_key(prev_bucket_key)
    end
    @move_results = move_results
    @signup_count_presenter = SignupCountPresenter.new(signup.run)

    mail(
      to: team_member.user_con_profile.email,
      subject: "#{subject_prefix(signup)} #{prev_state.humanize} -> #{signup.state.humanize}: \
#{signup.user_con_profile.name}"
    )
  end

  def user_signup_moved(move_result)
    @move_result = move_result
    if @move_result.is_a?(Hash)
      @move_result = EventVacancyFillService::SignupMoveResult.from_h(@move_result)
    end
    @signup = @move_result.signup

    if @move_result.prev_state == 'waitlisted'
      subject = 'Signup confirmed'
    else
      subject = 'Signup status change'
    end

    mail(
      to: @signup.user_con_profile.email,
      subject: "#{subject_prefix(@signup)} #{subject}"
    )
  end

  private

  def subject_prefix(signup)
    "[#{signup.event.convention.name}: #{signup.event.title}]"
  end
end
