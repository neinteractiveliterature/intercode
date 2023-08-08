# frozen_string_literal: true
class Signups::SignupConfirmationNotifier < Notifier
  include Signups::SignupNotificationsHelper

  attr_reader :signup

  def initialize(signup:)
    @signup = signup
    super(convention: signup.run.event.convention, event_key: "signups/signup_confirmation")
  end

  def liquid_assigns
    super.merge("signup" => signup)
  end

  def destinations
    [signup.user_con_profile]
  end
end
