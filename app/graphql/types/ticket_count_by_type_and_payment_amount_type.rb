class Types::TicketCountByTypeAndPaymentAmountType < Types::BaseObject
  field :count, Integer, null: false
  field :ticket_type, Types::TicketTypeType, null: false
  field :payment_amount, Types::MoneyType, null: false

  def ticket_type
    RecordLoader.for(TicketType).load(object[:ticket_type_id])
  end
end
