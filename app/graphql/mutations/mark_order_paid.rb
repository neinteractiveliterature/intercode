# frozen_string_literal: true
class Mutations::MarkOrderPaid < Mutations::BaseMutation
  field :order, Types::OrderType, null: false

  argument :id, ID, required: false

  load_and_authorize_model_with_id Order, :id, :update

  def resolve(**_args)
    raise "Order is #{order.status}" unless order.status == "unpaid"

    order.update!(
      status: "paid",
      payment_note:
        "Marked as paid by #{user_con_profile.name_without_nickname} \
on #{Time.now.in_time_zone(convention.timezone).strftime("%B %-d, %Y at %l:%M%P")}"
    )

    { order: }
  end
end
