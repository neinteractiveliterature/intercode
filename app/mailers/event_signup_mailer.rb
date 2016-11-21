class EventSignupMailer < ApplicationMailer
  def new_signup(signup, team_member)
    @signup = signup

    mail(
      to: team_member.user_con_profile.email,
      subject: "#{subject_prefix(signup)} Signup: #{signup.user_con_profile.name}"
    )
  end

  private

  def subject_prefix(signup)
    "[#{signup.event.convention.name}: #{signup.event.title}]"
  end
end
