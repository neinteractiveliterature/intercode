# frozen_string_literal: true
class Types::TicketTypeType < Types::BaseObject
  description "A kind of ticket that can be held for a convention or event"
  include DeprecatedTicketApiCompat

  field :id, ID, null: false, description: "The ID of this ticket type"

  field :maximum_event_provided_tickets,
        Integer,
        null: false,
        description: "How many of these tickets an event can provide to its team members" do
    argument :event_id,
             ID,
             required: false,
             camelize: true,
             description: "An event whose override of this number should be used"
  end

  field :parent,
        Types::TicketTypeParentType,
        null: false,
        description: "The convention or event this ticket type belongs to"

  field :allows_event_signups, Boolean, null: false, description: "Whether holders can sign up for events"
  field :convention,
        Types::ConventionType,
        association_model: TicketType,
        null: true,
        description: "The convention this ticket type belongs to, if it isn't specific to an event"
  field :counts_towards_convention_maximum,
        Boolean,
        null: false,
        description: "Whether these tickets count against the convention's attendance limit"
  field :description, String, null: true, description: "A human-readable description of this ticket type"
  field :event,
        Types::EventType,
        association_model: TicketType,
        null: true,
        description: "The event this ticket type belongs to, if it is specific to one"
  field :name, String, null: false, description: "The identifier-style name of this ticket type"
  field :providing_products,
        [Types::ProductType],
        association_model: TicketType,
        null: false,
        description: "The products that sell this type of ticket"

  def maximum_event_provided_tickets(**args)
    if args[:event_id]
      object.maximum_event_provided_tickets_for_event_id(args[:event_id])
    else
      object.maximum_event_provided_tickets
    end
  end

  # Force convention and parent loaders to resolve before calling `parent`, effectively emulating an eager load
  def parent
    convention
    event
    object.parent
  end
end
