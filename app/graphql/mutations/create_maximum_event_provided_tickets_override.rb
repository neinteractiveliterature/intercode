class Mutations::CreateMaximumEventProvidedTicketsOverride < Mutations::BaseMutation
  field :maximum_event_provided_tickets_override,
    Types::MaximumEventProvidedTicketsOverrideType,
    null: false

  argument :event_id, Integer, required: true, camelize: false
  argument :ticket_type_id, Integer, required: true, camelize: false
  argument :override_value, Integer, required: true, camelize: false

  attr_reader :event

  define_authorization_check do |args|
    @event = convention.events.find(args[:event_id])
    policy(MaximumEventProvidedTicketsOverride.new(event: event)).create?
  end

  def resolve(**args)
    override = event.maximum_event_provided_tickets_overrides.create!(
      ticket_type_id: args[:ticket_type_id],
      override_value: args[:override_value]
    )

    { maximum_event_provided_tickets_override: override }
  end
end
