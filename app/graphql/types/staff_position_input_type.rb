# frozen_string_literal: true
class Types::StaffPositionInputType < Types::BaseInputObject
  argument :name, String, required: false
  argument :email, String, required: false
  argument :visible, Boolean, required: false
  argument :transitional_user_con_profile_ids,
           [ID],
           required: false,
           camelize: true,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the userConProfileIds field so that \
we can remove this temporary one."
  argument :user_con_profile_ids, [ID], required: false, camelize: true
  argument :cc_addresses, [String], required: false, camelize: false
  argument :email_aliases, [String], required: false, camelize: false
end
