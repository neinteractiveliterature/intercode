class Types::StaffPositionType < Types::BaseObject
  field :id, Integer, null: false
  field :name, String, null: true
  field :email, String, null: true
  field :visible, Boolean, null: true
  field :user_con_profiles, [Types::UserConProfileType, null: true], null: true

  def user_con_profiles
    AssociationLoader.for(StaffPosition, :user_con_profiles).load(@object)
  end
end
