# frozen_string_literal: true
class Types::UserActivityAlertInputType < Types::BaseInputObject
  argument :transitional_user_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the userId field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :user_id, ID, required: false, camelize: true
  argument :partial_name, String, required: false, camelize: false
  argument :email, String, required: false
  argument :trigger_on_user_con_profile_create, Boolean, required: false, camelize: false
  argument :trigger_on_ticket_create, Boolean, required: false, camelize: false
end
