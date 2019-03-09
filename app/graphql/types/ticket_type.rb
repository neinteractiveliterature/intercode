class Types::TicketType < Types::BaseObject

  field :id, Integer, null: false
  field :convention, Types::ConventionType, null: false
  field :user_con_profile, Types::UserConProfileType, null: false
  field :ticket_type, Types::TicketTypeType, null: false

  def ticket_type
    RecordLoader.for(TicketType).load(object.ticket_type_id)
  end

  field :payment_amount, Types::MoneyType, null: true
  field :payment_note, String, null: true
  field :charge_id, String, null: true
  field :provided_by_event, Types::EventType, null: true

  def provided_by_event
    RecordLoader.for(Event).load(object.provided_by_event_id)
  end

  field :created_at, Types::DateType, null: false
  field :updated_at, Types::DateType, null: false
end
