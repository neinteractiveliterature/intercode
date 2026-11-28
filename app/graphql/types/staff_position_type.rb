# frozen_string_literal: true
class Types::StaffPositionType < Types::BaseObject
  description "A staff role at a convention, which can grant permissions and receive email"
  field :cc_addresses, [String], null: false, description: "Addresses copied on email sent to this position"
  field :email, String, null: true, description: "The email address for this position"
  field :email_aliases, [String], null: false, description: "Other addresses that also reach this position"
  field :id, ID, null: false, description: "The ID of this staff position"
  field :name, String, null: false, description: "The name of this position"
  field :permissions, [Types::PermissionType], null: false, description: "The permissions this position grants"
  field :user_con_profiles, [Types::UserConProfileType], null: false, description: "The people who hold this position"
  field :visible, Boolean, null: true, description: "Whether this position is shown publicly"

  association_loaders StaffPosition, :user_con_profiles, :permissions
end
