# frozen_string_literal: true
class Types::UserActivityAlertInputType < Types::BaseInputObject
  argument :email, String, required: false
  argument :partial_name, String, required: false, camelize: false
  argument :trigger_on_ticket_create, Boolean, required: false, camelize: false
  argument :trigger_on_user_con_profile_create, Boolean, required: false, camelize: false
  argument :user_id, ID, required: false, camelize: true
end
