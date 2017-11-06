Types::UserConProfileType = GraphQL::ObjectType.define do
  name "UserConProfile"

  field :id, !types.Int
  field :convention, Types::ConventionType
  field :privileges, types[types.String]
  field :name, types.String
  field :name_without_nickname, types.String
  field :first_name, types.String
  field :last_name, types.String
  field :nickname, types.String
  field :bio, types.String
  field :show_nickname_in_bio, types.Boolean
  field :birth_date, Types::DateType
  field :gender, types.String
  field :address1, types.String
  field :address2, types.String
  field :city, types.String
  field :state, types.String
  field :zipcode, types.String
  field :country, types.String
  field :day_phone, types.String
  field :evening_phone, types.String
  field :best_call_time, types.String
  field :preferred_contact, types.String
  field :ticket, Types::TicketType
end
