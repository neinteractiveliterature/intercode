# frozen_string_literal: true
class Types::MaximumEventProvidedTicketsOverrideType < Types::BaseObject
  authorize_record

  field :id, ID, null: false
  field :event, Types::EventType, null: false

  def event
    dataloader.with(Sources::ActiveRecordAssociation, MaximumEventProvidedTicketsOverride, :event).load(object)
  end

  field :ticket_type, Types::TicketTypeType, null: false

  def ticket_type
    dataloader.with(Sources::ActiveRecordAssociation, MaximumEventProvidedTicketsOverride, :ticket_type).load(object)
  end

  field :override_value, Integer, null: false
end
