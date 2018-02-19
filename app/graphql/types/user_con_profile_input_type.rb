Types::UserConProfileInputType = GraphQL::InputObjectType.define do
  name 'UserConProfileInput'

  input_field :first_name, types.String
  input_field :last_name, types.String
  input_field :nickname, types.String
  input_field :privileges, types[types.String]
  input_field :bio, types.String
  input_field :show_nickname_in_bio, types.Boolean
  input_field :form_response_attrs_json, types.String
  input_field :birth_date, Types::DateType
  input_field :address, types.String
  input_field :city, types.String
  input_field :state, types.String
  input_field :zipcode, types.String
  input_field :country, types.String
  input_field :day_phone, types.String
  input_field :evening_phone, types.String
  input_field :best_call_time, types.String
  input_field :preferred_contact, types.String
end
