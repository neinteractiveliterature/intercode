# frozen_string_literal: true
class Types::TicketTypeType < Types::BaseObject
  include DeprecatedTicketApiCompat

  field :id, ID, null: false

  field :maximum_event_provided_tickets, Integer, null: false do
    argument :event_id, ID, required: false, camelize: true
  end

  field :parent, Types::TicketTypeParentType, null: false

  field :allows_event_signups, Boolean, null: false
  field :convention, Types::ConventionType, null: true
  field :counts_towards_convention_maximum, Boolean, null: false
  field :description, String, null: true
  field :event, Types::EventType, null: true
  field :name, String, null: false
  field :providing_products, [Types::ProductType], null: false

  association_loaders TicketType, :convention, :event, :providing_products

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
