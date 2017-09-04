Types::EventType = GraphQL::ObjectType.define do
  name "Event"

  field :id, !types.Int
  field :title, types.String
  field :author, types.String
  field :email, types.String
  field :organization, types.String
  field :category, types.String
  field :url, types.String
  field :notify_on_changes, types.Boolean
  field :player_constraints, types.String
  field :length_seconds, types.Int
  field :can_play_concurrently, types.Boolean
  field :con_mail_destination, types.String
  field :description, types.String
  field :short_blurb, types.String
  field :status, types.String
  field :runs, types[Types::RunType]
end
