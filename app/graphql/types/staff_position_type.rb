# frozen_string_literal: true
class Types::StaffPositionType < Types::BaseObject
  field :cc_addresses, [String], null: false
  field :email, String, null: true
  field :email_aliases, [String], null: false
  field :id, ID, null: false
  field :name, String, null: false
  field :permissions, [Types::PermissionType], null: false
  field :user_con_profiles, [Types::UserConProfileType], null: false
  field :visible, Boolean, null: true

  association_loaders StaffPosition, :user_con_profiles, :permissions
end
