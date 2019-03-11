class Types::StaffPositionType < Types::BaseObject
  field :id, Integer, null: false
  field :name, String, null: true
  field :email, String, null: true
  field :visible, Boolean, null: true
  field :user_con_profiles, [Types::UserConProfileType], null: true
  field :permissions, [Types::PermissionType], null: false

  association_loaders StaffPosition, :user_con_profiles, :permissions
end
