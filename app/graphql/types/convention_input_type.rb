Types::ConventionInputType = GraphQL::InputObjectType.define do
  name 'ConventionInput'
  input_field :accepting_proposals, types.Boolean
  input_field :starts_at, Types::DateType
  input_field :ends_at, Types::DateType
  input_field :name, types.String
  input_field :domain, types.String
  input_field :timezone_name, types.String
  input_field :registrations_frozen, types.Boolean
  input_field :show_schedule, Types::ShowScheduleType
  input_field :maximum_tickets, types.Int

  input_field :maximum_event_signups, Types::ScheduledValueInputType
end
