class Types::TicketType < Types::BaseObject
  field :id, Integer, null: false
  field :convention, Types::ConventionType, null: false
  field :user_con_profile, Types::UserConProfileType, null: false
  field :ticket_type, Types::TicketTypeType, null: false
  field :provided_by_event, Types::EventType, null: true
  field :order_entry, Types::OrderEntryType, null: false
  field :created_at, Types::DateType, null: false
  field :updated_at, Types::DateType, null: false

  association_loaders Ticket, :ticket_type, :order_entry, :provided_by_event, :user_con_profile

  authorize_record

  field :payment_amount, Types::MoneyType,
    null: true, deprecation_reason: 'Use order_entry for payment fields'
  def payment_amount
    object.order_entry&.price_per_item
  end
  field :payment_note, String,
    null: true, deprecation_reason: 'Use order_entry for payment fields'
  def payment_note
    object.order_entry&.order&.payment_note
  end
  field :charge_id, String,
    null: true, deprecation_reason: 'Use order_entry for payment fields'
  def charge_id
    object.order_entry&.order&.charge_id
  end
end
