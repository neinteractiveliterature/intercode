class Types::OrderStatusType < Types::BaseEnum
  value('pending', 'Order has not yet been submitted')
  value('unpaid', 'Order is submitted but not yet paid')
  value('paid', 'Order has been submitted and paid')
  value('cancelled', 'Order has been cancelled')
end
