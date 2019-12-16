class SignupRequestsMailer < ApplicationMailer
  def new_signup_request(signup_request)
    notification_mail(SignupRequests::NewSignupRequestNotifier.new(signup_request: signup_request))
  end

  def request_accepted(signup_request)
    notification_mail(SignupRequests::RequestAcceptedNotifier.new(signup_request: signup_request))
  end
end
