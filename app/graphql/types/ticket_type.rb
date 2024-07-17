# frozen_string_literal: true
class Types::TicketType < Types::BaseObject
  field :convention, Types::ConventionType, null: false
  field :created_at, Types::DateType, null: false
  field :id, ID, null: false
  field :order_entry, Types::OrderEntryType, null: true
  field :provided_by_event, Types::EventType, null: true
  field :run, Types::RunType, null: true
  field :ticket_type, Types::TicketTypeType, null: false
  field :updated_at, Types::DateType, null: false
  field :user_con_profile, Types::UserConProfileType, null: false

  association_loaders Ticket, :ticket_type, :run, :order_entry, :provided_by_event, :user_con_profile

  authorize_record
end
