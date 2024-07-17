# frozen_string_literal: true
class Types::MaximumEventProvidedTicketsOverrideType < Types::BaseObject
  authorize_record

  field :event, Types::EventType, null: false
  field :id, ID, null: false

  field :ticket_type, Types::TicketTypeType, null: false


  field :override_value, Integer, null: false


  def event
    dataloader.with(Sources::ActiveRecordAssociation, MaximumEventProvidedTicketsOverride, :event).load(object)
  end

  def ticket_type
    dataloader.with(Sources::ActiveRecordAssociation, MaximumEventProvidedTicketsOverride, :ticket_type).load(object)
  end
end
