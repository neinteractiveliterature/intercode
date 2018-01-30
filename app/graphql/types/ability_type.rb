Types::AbilityType = GraphQL::ObjectType.define do
  name "Ability"

  field :can_override_maximum_event_provided_tickets, !types.Boolean do
    resolve -> (obj, _args, ctx) {
      override = ctx[:convention].ticket_types.new.maximum_event_provided_tickets_overrides.new
      obj.can?(:create, override)
    }
  end
end
