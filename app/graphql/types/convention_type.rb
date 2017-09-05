Types::ConventionType = GraphQL::ObjectType.define do
  name "Convention"
  field :accepting_bids, types.Boolean
  field :precon_bids_allowed, types.Boolean
  field :created_at, Types::DateType
  field :updated_at, Types::DateType
  field :starts_at, Types::DateType
  field :ends_at, Types::DateType
  field :name, types.String
  field :domain, types.String
  field :timezone_name, types.String
  field :registrations_frozen, types.Boolean
end
