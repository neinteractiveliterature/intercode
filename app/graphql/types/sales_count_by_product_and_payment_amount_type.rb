# frozen_string_literal: true
class Types::SalesCountByProductAndPaymentAmountType < Types::BaseObject
  field :count, Integer, null: false
  field :product, Types::ProductType, null: false
  field :status, Types::OrderStatusType, null: false
  field :payment_amount, Types::MoneyType, null: false

  def product
    dataloader.with(Sources::ModelById, Product).load(object[:product_id])
  end
end
