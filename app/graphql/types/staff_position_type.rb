Types::StaffPositionType = GraphQL::ObjectType.define do
  name 'StaffPosition'
  field :id, !types.Int
  field :name, types.String
  field :email, types.String
  field :visible, types.Boolean
  field :user_con_profiles, types[Types::UserConProfileType] do
    resolve ->(obj, _args, _ctx) {
      AssociationLoader.for(StaffPosition, :user_con_profiles).load(obj)
    }
  end
end
