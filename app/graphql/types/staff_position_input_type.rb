# frozen_string_literal: true
class Types::StaffPositionInputType < Types::BaseInputObject
  argument :cc_addresses, [String], required: false, camelize: false
  argument :email, String, required: false
  argument :email_aliases, [String], required: false, camelize: false
  argument :name, String, required: false
  argument :user_con_profile_ids, [ID], required: false, camelize: true
  argument :visible, Boolean, required: false
end
