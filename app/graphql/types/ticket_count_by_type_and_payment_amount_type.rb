# frozen_string_literal: true
class Types::TicketCountByTypeAndPaymentAmountType < Types::BaseObject
  field :count, Integer, null: false
  field :payment_amount, Types::MoneyType, null: false
  field :ticket_type, Types::TicketTypeType, null: false

  def ticket_type
    dataloader.with(Sources::ModelById, TicketType).load(object[:ticket_type_id])
  end
end
