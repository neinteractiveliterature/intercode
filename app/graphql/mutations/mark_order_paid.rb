# frozen_string_literal: true
class Mutations::MarkOrderPaid < Mutations::BaseMutation
  field :order, Types::OrderType, null: false

  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false

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
