class EventSignupMailer < ApplicationMailer
  def new_signup(signup, team_member)
    @signup = signup
    @signup_count_presenter = SignupCountPresenter.new(signup.run)

    mail(
      from: from_address_for_convention(@signup.event.convention),
      to: team_member.user_con_profile.email,
      subject: "#{subject_prefix(signup.event)} Signup: #{signup.user_con_profile.name}"
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
      from: from_address_for_convention(@signup.event.convention),
      to: team_member.user_con_profile.email,
      subject: "#{subject_prefix(signup.event)} #{prev_state.humanize} -> #{signup.state.humanize}: \
#{signup.user_con_profile.name}"
    )
  end

  def registration_policy_change_moved_signups(event, move_results, team_member, whodunit)
    @event = event
    @move_results = move_results.map { |hash| SignupMoveResult.from_h(hash) }
    @whodunit = whodunit

    @signups_by_id = Signup.where(id: @move_results.map(&:signup_id)).includes(:run).index_by(&:id)
    @move_results_by_run = @move_results.group_by do |move_result|
      @signups_by_id[move_result.signup_id].run
    end
    @runs = @move_results_by_run.keys.sort_by(&:starts_at)

    mail(
      from: from_address_for_convention(@event.convention),
      to: team_member.user_con_profile.email,
      subject: "#{subject_prefix(@event)} Signups moved due to bucket changes"
    )
  end

  def user_signup_moved(move_result)
    @move_result = move_result
    @move_result = SignupMoveResult.from_h(@move_result) if @move_result.is_a?(Hash)
    @signup = @move_result.signup

    if @move_result.prev_state == 'waitlisted'
      subject = 'Signup confirmed'
    else
      subject = 'Signup status change'
    end

    mail(
      from: from_address_for_convention(@signup.event.convention),
      to: @signup.user_con_profile.email,
      subject: "#{subject_prefix(@signup.event)} #{subject}"
    )
  end

  private

  def subject_prefix(event)
    "[#{event.convention.name}: #{event.title}]"
  end
end
