class AddOrderEntryIdToTickets < ActiveRecord::Migration[6.0]
  def change
    add_reference :tickets, :order_entry, null: true, foreign_key: true

    reversible do |dir|
      dir.up { convert_tickets_to_order_entries }
      dir.down { revert_ticket_conversion }
    end

    remove_column :tickets, :charge_id, :string
    remove_column :tickets, :payment_amount_cents, :integer
    remove_column :tickets, :payment_amount_currency, :string
    remove_column :tickets, :payment_note, :text
  end

  def convert_tickets_to_order_entries
    Ticket.where.not(charge_id: nil).includes(
      ticket_type: :providing_products, user_con_profile: :convention
    ).find_each do |ticket|
      say_with_time(
        "Converting #{ticket.user_con_profile.convention.name} \
#{ticket.ticket_type.description} for #{ticket.user_con_profile.name_without_nickname} to order"
      ) do
        order = ticket.user_con_profile.orders.create!(
          status: 'paid',
          charge_id: ticket.charge_id,
          payment_amount_cents: ticket.payment_amount_cents,
          payment_amount_currency: ticket.payment_amount_currency,
          payment_note: ticket.payment_note,
          submitted_at: ticket.created_at,
          paid_at: ticket.created_at
        )

        ensure_ticket_product_exists(ticket)

        order_entry = order.order_entries.create!(
          product: ticket.ticket_type.providing_products.first,
          quantity: 1,
          price_per_item_cents: ticket.payment_amount_cents,
          price_per_item_currency: ticket.payment_amount_currency
        )

        ticket.update!(order_entry: order_entry)
      end
    end
  end

  def ensure_ticket_product_exists(ticket)
    return if ticket.ticket_type.providing_products.first

    say "#{ticket.user_con_profile.convention.name} #{ticket.ticket_type.description} \
has no corresponding product, creating an unavailable one"
    ticket.ticket_type.providing_products.create!(
      convention: ticket.ticket_type.convention,
      available: false,
      name: ticket.ticket_type.description,
      description:
        "#{ticket.ticket_type.description} for #{ticket.ticket_type.convention.name}",
      payment_options: ['stripe'],
      pricing_structure: PricingStructure.new(
        pricing_strategy: 'fixed',
        value: Money.new(ticket.payment_amount_cents, ticket.payment_amount_currency)
      )
    )
  end

  def revert_ticket_conversion
    Ticket.where.not(order_entry_id: nil).includes(
      user_con_profile: :convention, order_entry: :order
    ).find_each do |ticket|
      say_with_time(
        "Converting #{ticket.user_con_profile.convention.name} \
#{ticket.ticket_type.description} for #{ticket.user_con_profile.name_without_nickname} \
to ticket fields"
      ) do
        ticket.update!(
          charge_id: ticket.order_entry.order.charge_id,
          payment_amount_cents: ticket.order_entry.price_per_item_cents,
          payment_amount_currency: ticket.order_entry.price_per_item_currency,
          payment_note: ticket.order_entry.order.payment_note
        )

        ticket.order_entry.order.destroy!
      end
    end
  end
end
