# frozen_string_literal: true
class Types::StaffPositionType < Types::BaseObject
  field :id, ID, null: false
  field :name, String, null: false
  field :email, String, null: true
  field :email_aliases, [String], null: false
  field :visible, Boolean, null: true
  field :user_con_profiles, [Types::UserConProfileType], null: false
  field :permissions, [Types::PermissionType], null: false
  field :cc_addresses, [String], null: false

  association_loaders StaffPosition, :user_con_profiles, :permissions
end
