class Types::SignupRequestStateType < Types::BaseEnum
  value('pending', 'The request has not yet been reviewed by a moderator')
  value(
    'accepted',
    "The request has been accepted and the requester has been signed up \
(see the result_signup field for the actual signup)")
  value('rejected', 'The request has been rejected and the requester has not been signed up')
  value('withdrawn', 'The requester withdrew their request before it was accepted or rejected')
end
