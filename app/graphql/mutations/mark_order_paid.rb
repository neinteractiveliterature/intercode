# frozen_string_literal: true
class Mutations::MarkOrderPaid < Mutations::BaseMutation
  field :order, Types::OrderType, null: false

  argument :id,
           Integer,
           deprecation_reason:
             'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
           required: false
  argument :transitional_id, ID, required: false, camelize: true

  load_and_authorize_model_with_id Order, :id, :update

  def resolve(**_args)
    raise "Order is #{order.status}" unless order.status == 'unpaid'

    order.update!(
      status: 'paid',
      payment_note:
        "Marked as paid by #{user_con_profile.name_without_nickname} \
on #{Time.now.in_time_zone(convention.timezone).strftime('%B %-d, %Y at %l:%M%P')}"
    )

    { order: order }
  end
end
