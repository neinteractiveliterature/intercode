# frozen_string_literal: true
class Types::TicketTypeType < Types::BaseObject
  include DeprecatedTicketApiCompat

  field :id, ID, null: false
  field :name, String, null: false
  field :counts_towards_convention_maximum, Boolean, null: false
  field :allows_event_signups, Boolean, null: false
  field :description, String, null: true
  field :convention, Types::ConventionType, null: false
  field :providing_products, [Types::ProductType], null: false

  association_loaders TicketType, :convention, :providing_products

  field :maximum_event_provided_tickets, Integer, null: false do
    argument :event_id, ID, required: false, camelize: true
  end

  def maximum_event_provided_tickets(**args)
    if args[:event_id]
      object.maximum_event_provided_tickets_for_event_id(args[:event_id])
    else
      object.maximum_event_provided_tickets
    end
  end
end
