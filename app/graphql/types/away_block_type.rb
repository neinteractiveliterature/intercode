Types::AwayBlockType = GraphQL::ObjectType.define do
  name "AwayBlock"

  field :start, Types::DateType
  field :finish, Types::DateType

  field :user_con_profile, Types::UserConProfileType do
    resolve ->(obj, _args, _ctx) {
      RecordLoader.for(UserConProfile).load(obj.user_con_profile_id)
    }
  end
end
