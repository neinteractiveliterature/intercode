# frozen_string_literal: true
class Mutations::CreateMaximumEventProvidedTicketsOverride < Mutations::BaseMutation
  field :maximum_event_provided_tickets_override, Types::MaximumEventProvidedTicketsOverrideType, null: false

  argument :event_id,
           Integer,
           deprecation_reason:
             'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
           required: false,
           camelize: false
  argument :transitional_event_id, ID, required: false, camelize: true
  argument :ticket_type_id,
           Integer,
           deprecation_reason:
             'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
           required: false,
           camelize: false
  argument :transitional_ticket_type_id, ID, required: false, camelize: true
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
