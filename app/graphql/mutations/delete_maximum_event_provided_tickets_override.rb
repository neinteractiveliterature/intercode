class Mutations::DeleteMaximumEventProvidedTicketsOverride < Mutations::BaseMutation
  field :maximum_event_provided_tickets_override,
    Types::MaximumEventProvidedTicketsOverrideType,
    null: false

  argument :id, Integer, required: true

  def resolve(**args)
    override = MaximumEventProvidedTicketsOverride.find(args[:id])
    override.destroy!

    { maximum_event_provided_tickets_override: override }
  end
end
