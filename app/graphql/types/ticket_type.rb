class Types::TicketType < Types::BaseObject
  field :id, Integer, null: false
  field :convention, Types::ConventionType, null: false
  field :user_con_profile, Types::UserConProfileType, null: false
  field :ticket_type, Types::TicketTypeType, null: false
  field :payment_amount, Types::MoneyType, null: true
  field :payment_note, String, null: true
  field :charge_id, String, null: true
  field :provided_by_event, Types::EventType, null: true
  field :created_at, Types::DateType, null: false
  field :updated_at, Types::DateType, null: false

  association_loaders Ticket, :ticket_type, :provided_by_event
end
