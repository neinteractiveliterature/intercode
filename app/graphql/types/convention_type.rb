Types::ConventionType = GraphQL::ObjectType.define do
  name 'Convention'
  field :accepting_proposals, types.Boolean
  field :created_at, Types::DateType
  field :updated_at, Types::DateType
  field :starts_at, Types::DateType
  field :ends_at, Types::DateType
  field :name, types.String
  field :domain, types.String
  field :timezone_name, types.String
  field :show_schedule, Types::ShowScheduleType
  field :maximum_tickets, types.Int
  field :maximum_event_signups, Types::ScheduledValueType
  field :ticket_name, !types.String
  field :user_con_profile_form, !Types::FormType
  field :event_proposal_form, !Types::FormType

  field :rooms, types[Types::RoomType] do
    guard ->(convention, _args, ctx) do
      ctx[:current_ability].can?(:read, Room.new(convention: convention))
    end

    resolve -> (convention, _args, _ctx) {
      AssociationLoader.for(Convention, :rooms).load(convention)
    }
  end

  field :staff_positions, types[Types::StaffPositionType] do
    guard ->(convention, _args, ctx) do
      ctx[:current_ability].can?(:read, StaffPosition.new(convention: convention))
    end

    resolve ->(convention, _args, _ctx) {
      AssociationLoader.for(Convention, :staff_positions).load(convention)
    }
  end

  field :ticket_types, types[Types::TicketTypeType] do
    guard ->(convention, _args, ctx) do
      ctx[:current_ability].can?(:read, TicketType.new(convention: convention))
    end

    resolve ->(convention, _args, _ctx) {
      AssociationLoader.for(Convention, :ticket_types).load(convention)
    }
  end

  connection :user_con_profiles, Types::UserConProfileType.connection_type, max_page_size: 1000 do
    argument :name, types.String

    guard ->(convention, _args, ctx) do
      ctx[:current_ability].can?(:read, UserConProfile.new(convention: convention))
    end

    resolve ->(convention, args, ctx) {
      grid_args = args.to_h.symbolize_keys.except(:first, :last, :after, :before)
      grid = UserConProfilesGrid.new(grid_args)
      grid.assets.accessible_by(ctx[:current_ability]).where(convention_id: convention.id)
    }
  end
end
