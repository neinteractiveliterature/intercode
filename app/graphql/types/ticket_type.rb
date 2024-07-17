# frozen_string_literal: true
class Types::TicketType < Types::BaseObject
  field :id, ID, null: false
  field :convention, Types::ConventionType, null: false
  field :run, Types::RunType, null: true
  field :user_con_profile, Types::UserConProfileType, null: false
  field :ticket_type, Types::TicketTypeType, null: false
  field :provided_by_event, Types::EventType, null: true
  field :order_entry, Types::OrderEntryType, null: true
  field :created_at, Types::DateType, null: false
  field :updated_at, Types::DateType, null: false

  association_loaders Ticket, :ticket_type, :run, :order_entry, :provided_by_event, :user_con_profile

  authorize_record
end
