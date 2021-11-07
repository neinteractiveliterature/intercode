# frozen_string_literal: true
class Mutations::CreateMaximumEventProvidedTicketsOverride < Mutations::BaseMutation
  field :maximum_event_provided_tickets_override, Types::MaximumEventProvidedTicketsOverrideType, null: false

  argument :transitional_event_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the eventId field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :event_id, ID, required: false, camelize: true
  argument :transitional_ticket_type_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the ticketTypeId field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :ticket_type_id, ID, required: false, camelize: true
  argument :override_value, Integer, required: true, camelize: false

  attr_reader :event

  define_authorization_check do |args|
    @event = convention.events.find(args[:transitional_event_id] || args[:event_id])
    policy(MaximumEventProvidedTicketsOverride.new(event: event)).create?
  end

  def resolve(**args)
    override =
      event.maximum_event_provided_tickets_overrides.create!(
        ticket_type_id: args[:transitional_ticket_type_id] || args[:ticket_type_id],
        override_value: args[:override_value]
      )

    { maximum_event_provided_tickets_override: override }
  end
end
