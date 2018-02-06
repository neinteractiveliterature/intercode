Types::AbilityType = GraphQL::ObjectType.define do
  name 'Ability'

  field :can_override_maximum_event_provided_tickets, !types.Boolean do
    resolve -> (obj, _args, ctx) {
      override = TicketType.new(convention: ctx[:convention])
        .maximum_event_provided_tickets_overrides
        .new
      obj.can?(:create, override)
    }
  end

  field :can_update_event, !types.Boolean do
    argument :event_id, !types.Int
    resolve -> (obj, args, _ctx) do
      ModelPermissionLoader.for(Event).load([obj, :update, args[:event_id]])
    end
  end

  field :can_delete_event, !types.Boolean do
    argument :event_id, !types.Int
    resolve -> (obj, args, _ctx) do
      ModelPermissionLoader.for(Event).load([obj, :delete, args[:event_id]])
    end
  end
end
