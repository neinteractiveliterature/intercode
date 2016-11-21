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
end