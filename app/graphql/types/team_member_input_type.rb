Types::TeamMemberInputType = GraphQL::InputObjectType.define do
  name 'TeamMemberInput'

  input_field :display, types.Boolean
  input_field :show_email, types.Boolean
  input_field :receive_con_email, types.Boolean
  input_field :receive_signup_email, types.Boolean
end
