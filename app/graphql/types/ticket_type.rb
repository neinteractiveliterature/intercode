# frozen_string_literal: true
class Types::TicketType < Types::BaseObject
  description "A person's admission to a convention"
  field :convention, Types::ConventionType, null: false, description: "The convention this ticket is for"
  field :created_at, Types::DateType, null: false, description: "When this ticket was created"
  field :id, ID, null: false, description: "The ID of this ticket"
  field :order_entry,
        Types::OrderEntryType,
        null: true,
        description: "The purchase that created this ticket, if it was bought"
  field :provided_by_event, Types::EventType, null: true, description: "The event that provided this ticket, if one did"
  field :run, Types::RunType, null: true, description: "The run this ticket is for, if it is for a particular run"
  field :ticket_type, Types::TicketTypeType, null: false, description: "The kind of ticket this is"
  field :updated_at, Types::DateType, null: false, description: "When this ticket was last updated"
  field :user_con_profile, Types::UserConProfileType, null: false, description: "The person this ticket belongs to"

  association_loaders Ticket, :ticket_type, :run, :order_entry, :provided_by_event, :user_con_profile

  authorize_record
end
