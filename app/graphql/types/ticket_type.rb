# frozen_string_literal: true
class Types::TicketType < Types::BaseObject
  description "A person's admission to a convention"
  field :convention,
        Types::ConventionType,
        null: false,
        resolve_batch: :batch_conventions,
        description: "The convention this ticket is for"
  field :created_at, Types::DateType, null: false, description: "When this ticket was created"
  field :id, ID, null: false, description: "The ID of this ticket"
  field :order_entry,
        Types::OrderEntryType,
        association_model: Ticket,
        null: true,
        description: "The purchase that created this ticket, if it was bought"
  field :provided_by_event,
        Types::EventType,
        association_model: Ticket,
        null: true,
        description: "The event that provided this ticket, if one did"
  field :run,
        Types::RunType,
        association_model: Ticket,
        null: true,
        description: "The run this ticket is for, if it is for a particular run"
  field :ticket_type,
        Types::TicketTypeType,
        association_model: Ticket,
        null: false,
        description: "The kind of ticket this is"
  field :updated_at, Types::DateType, null: false, description: "When this ticket was last updated"
  field :user_con_profile,
        Types::UserConProfileType,
        association_model: Ticket,
        null: false,
        description: "The person this ticket belongs to"

  authorize_record

  # A ticket's convention is its profile's convention, so it's loaded in two steps
  def self.batch_conventions(tickets, context)
    profiles = context.dataload_all(Sources::ActiveRecordAssociation, Ticket, :user_con_profile, tickets)
    context.dataload_all(Sources::ActiveRecordAssociation, UserConProfile, :convention, profiles)
  end

  def convention
    profile = dataloader.with(Sources::ActiveRecordAssociation, Ticket, :user_con_profile).load(object)
    dataloader.with(Sources::ActiveRecordAssociation, UserConProfile, :convention).load(profile)
  end
end
