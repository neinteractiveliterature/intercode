# frozen_string_literal: true
class Types::UserActivityAlertInputType < Types::BaseInputObject
  argument :user_id, ID, required: false, camelize: true
  argument :partial_name, String, required: false, camelize: false
  argument :email, String, required: false
  argument :trigger_on_user_con_profile_create, Boolean, required: false, camelize: false
  argument :trigger_on_ticket_create, Boolean, required: false, camelize: false
end
