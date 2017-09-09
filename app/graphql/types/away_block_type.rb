Types::AwayBlockType = GraphQL::ObjectType.define do
  name "AwayBlock"
  field :user_con_profile, Types::UserConProfileType
  field :start, Types::DateType
  field :finish, Types::DateType
end
