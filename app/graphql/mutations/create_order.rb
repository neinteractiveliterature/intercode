# frozen_string_literal: true
class Mutations::CreateOrder < Mutations::BaseMutation
  include OrderEntryInputs

  field :order, Types::OrderType, null: false

  argument :order, Types::OrderInputType, required: true
  argument :order_entries, [Types::OrderEntryInputType], required: false, camelize: false
  argument :status, Types::OrderStatusType, required: true
  argument :user_con_profile_id, ID, required: false, camelize: true

  attr_reader :order

  define_method :authorized? do |args|
    user_con_profile = UserConProfile.find(args[:user_con_profile_id])
    @order = user_con_profile.orders.new
    self.class.check_authorization(policy(@order), :create)
  end

  # rubocop:disable Metrics/AbcSize
  def resolve(**args)
    raise GraphQL::ExecutionError, 'Cannot create pending orders' if args[:status] == 'pending'

    order_attrs = args[:order].to_h.merge(status: args[:status], submitted_at: Time.zone.now)
    if order_attrs[:payment_amount]
      order_attrs[:payment_amount] = MoneyHelper.coerce_money_input(order_attrs[:payment_amount])
    end
    order.assign_attributes(order_attrs)
    order.save!

    (args[:order_entries] || []).each do |order_entry_input|
      order_entry = order.order_entries.new
      order_entry.assign_attributes(process_order_entry_input(order_entry_input, order_entry))
      order_entry.save!

      next unless order_entry_input.ticket_id

      ticket = Ticket.where(user_con_profile_id: @order.user_con_profile.id).find(order_entry_input.ticket_id)
      ticket.update!(order_entry:)
      order_entry.tickets.reload
    end

    { order: }
  end
  # rubocop:enable Metrics/AbcSize
end
