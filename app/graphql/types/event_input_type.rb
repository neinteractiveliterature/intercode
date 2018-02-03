Types::EventInputType = GraphQL::InputObjectType.define do
  name 'EventInput'

  input_field :title, types.String
  input_field :author, types.String
  input_field :email, types.String
  input_field :organization, types.String
  input_field :category, types.String
  input_field :url, types.String
  input_field :participant_communications, types.String
  input_field :age_restrictions, types.String
  input_field :content_warnings, types.String
  input_field :length_seconds, types.Int
  input_field :can_play_concurrently, types.Boolean
  input_field :con_mail_destination, types.String
  input_field :description, types.String
  input_field :short_blurb, types.String
  input_field :registration_policy, Types::RegistrationPolicyInputType
end
