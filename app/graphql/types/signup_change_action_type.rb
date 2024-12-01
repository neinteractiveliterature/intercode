# frozen_string_literal: true
class Types::SignupChangeActionType < Types::BaseEnum
  description "The action taken that caused a signup to change."

  value "self_service_signup"
  value "admin_create_signup"
  value "accept_signup_request"
  value "change_registration_policy"
  value "hold_expired"
  value "ticket_purchase"
  value "vacancy_fill"
  value "withdraw"
  value "accept_signup_ranked_choice"
  value "freeze_bucket_assignments"
  value "unknown"
end
