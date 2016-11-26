module EventSignupMailerHelper
  def signup_description(signup, action_description)
    "#{@signup.user_con_profile.name} #{action_description} #{run_description(signup.run)}."
  end

  def run_description(run)
    if run.event.runs.size > 1
      "#{run.event.title} on #{run.starts_at.to_s(:long_with_weekday)}"
    else
      run.event.title
    end
  end

  def move_result_description(move_result)
    move_result = EventVacancyFillService::SignupMoveResult.from_h(move_result) if move_result.is_a?(Hash)
    signup = move_result.signup

    "#{signup.user_con_profile.name}: #{prev_signup_state_description(move_result)} → #{new_signup_state_description(move_result)}"
  end

  def prev_signup_state_description(move_result)
    if move_result.prev_state == 'waitlisted'
      "Waitlisted"
    else
      move_result.signup.run.bucket_with_key(move_result.prev_bucket_key).name
    end
  end

  def new_signup_state_description(move_result)
    new_state_description = move_result.signup.run.bucket_with_key(move_result.bucket_key).name

    if move_result.prev_state == 'waitlisted'
      "Confirmed (#{new_state_description})"
    else
      new_state_description
    end
  end
end