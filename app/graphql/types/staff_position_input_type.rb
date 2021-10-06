# frozen_string_literal: true
class Types::StaffPositionInputType < Types::BaseInputObject
  argument :name, String, required: false
  argument :email, String, required: false
  argument :visible, Boolean, required: false
  argument :user_con_profile_ids,
           [Integer],
           required: false,
           camelize: false,
           deprecation_reason:
             "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID."
  argument :transitional_user_con_profile_ids, [ID], required: false, camelize: true
  argument :cc_addresses, [String], required: false, camelize: false
  argument :email_aliases, [String], required: false, camelize: false
end
