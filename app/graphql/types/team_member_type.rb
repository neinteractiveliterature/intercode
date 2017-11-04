Types::TeamMemberType = GraphQL::ObjectType.define do
  name "TeamMember"

  field :id, !types.Int
  field :event, !Types::EventType
  field :user_con_profile, !Types::UserConProfileType
  field :display, !types.Boolean
  field :show_email, !types.Boolean
  field :receive_con_email, !types.Boolean
  field :receive_signup_email, !types.Boolean
end
