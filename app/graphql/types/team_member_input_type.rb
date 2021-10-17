# frozen_string_literal: true
class Types::TeamMemberInputType < Types::BaseInputObject
  argument :display_team_member, Boolean, required: false, camelize: false
  argument :show_email, Boolean, required: false, camelize: false
  argument :receive_con_email, Boolean, required: false, camelize: false
  argument :receive_signup_email, Types::ReceiveSignupEmailType, required: false, camelize: false
end
