Types::TeamMemberType = GraphQL::ObjectType.define do
  name 'TeamMember'

  field :id, !types.Int
  field :display, !types.Boolean
  field :show_email, !types.Boolean
  field :receive_con_email, !types.Boolean
  field :receive_signup_email, !types.Boolean

  field :event, !Types::EventType do
    resolve ->(obj, _args, _ctx) {
      RecordLoader.for(Event).load(obj.event_id)
    }
  end

  field :user_con_profile, !Types::UserConProfileType do
    resolve ->(obj, _args, _ctx) {
      RecordLoader.for(UserConProfile).load(obj.user_con_profile_id)
    }
  end
end
