# frozen_string_literal: true
class Types::SignupChangeActionType < Types::BaseEnum
  value 'self_service_signup'
  value 'admin_create_signup'
  value 'accept_signup_request'
  value 'change_registration_policy'
  value 'hold_expired'
  value 'vacancy_fill'
  value 'withdraw'
  value 'unknown'
end
