class Mutations::UpdateMaximumEventProvidedTicketsOverride < Mutations::BaseMutation
  field :maximum_event_provided_tickets_override,
    Types::MaximumEventProvidedTicketsOverrideType,
    null: false

  argument :id, Integer, required: true
  argument :override_value, Integer, required: true, camelize: false

  def resolve(**args)
    override = MaximumEventProvidedTicketsOverride.find(args[:id])
    override.update!(override_value: args[:override_value])

    { maximum_event_provided_tickets_override: override }
  end
end
