class Signups::NewSignupNotifier < Notifier
  include Signups::SignupNotificationsHelper

  attr_reader :signup

  def initialize(signup:)
    @signup = signup
    super(convention: signup.run.event.convention, event_key: 'signups/new_signup')
  end

  def liquid_assigns
    super.merge('signup' => signup)
  end

  def destinations
    team_members_to_notify_for_signup(signup).map(&:user_con_profile)
  end
end
