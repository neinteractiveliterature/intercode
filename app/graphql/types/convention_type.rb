Types::ConventionType = GraphQL::ObjectType.define do
  name "Convention"
  field :accepting_proposals, types.Boolean
  field :precon_bids_allowed, types.Boolean
  field :created_at, Types::DateType
  field :updated_at, Types::DateType
  field :starts_at, Types::DateType
  field :ends_at, Types::DateType
  field :name, types.String
  field :domain, types.String
  field :timezone_name, types.String
  field :registrations_frozen, types.Boolean
  field :show_schedule, Types::ShowScheduleType
  field :maximum_tickets, types.Int
  field :maximum_event_signups, Types::ScheduledValueType

  field :away_blocks, types[Types::AwayBlockType] do
    resolve ->(convention, _args, _ctx) do
      AssociationLoader.for(Convention, :away_blocks).load(convention)
    end
  end

  field :rooms, types[Types::RoomType] do
    resolve -> (convention, _args, _ctx) {
      AssociationLoader.for(Convention, :rooms).load(convention)
    }
  end

  field :ticket_types, types[Types::TicketTypeType] do
    resolve ->(convention, _args, _ctx) {
      AssociationLoader.for(Convention, :ticket_types).load(convention)
    }
  end

  connection :user_con_profiles, Types::UserConProfileType.connection_type, max_page_size: 1000 do
    resolve ->(convention, _args, _ctx) {
      convention.user_con_profiles.order('last_name', 'first_name')
    }
  end
end
