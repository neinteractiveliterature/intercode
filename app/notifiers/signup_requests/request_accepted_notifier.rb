class Signups::RequestAcceptedNotifier < Notifier
  attr_reader :signup_request

  def initialize(signup_request:)
    @signup_request = signup_request
    super(convention: signup_request.convention, event_key: 'signup_requests/request_accepted')
  end

  def liquid_assigns
    super.merge('signup_request' => signup_request)
  end

  def destinations
    [signup_request.user_con_profile]
  end
end
