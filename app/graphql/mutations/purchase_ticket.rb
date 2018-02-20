Mutations::PurchaseTicket = GraphQL::Relay::Mutation.define do
  name 'PurchaseTicket'
  return_field :ticket, Types::TicketType

  input_field :ticket_type_id, !types.Int
  input_field :stripe_token, !types.String

  resolve ->(_obj, args, ctx) do
    ticket_type = ctx[:convention].ticket_types.find(args[:ticket_type_id])

    unless ticket_type.publicly_available?
      raise StandardError, "Sorry, but \"#{ticket_type.description}\" \
#{ctx[:convention].ticket_name.pluralize} are not publicly available.  Please choose a different
#{ctx[:convention].ticket_name} type or contact #{ctx[:convention].name} staff."
    end

    if ctx[:convention].maximum_tickets
      ticket_count = ctx[:convention].tickets.counts_towards_convention_maximum.count
      if ticket_count >= ctx[:convention].maximum_tickets
        raise StandardError, "We're sorry, but #{ctx[:convention].name} is currently sold out."
      end
    end

    current_price = ticket_type.price

    customer = Stripe::Customer.create(
      email: ctx[:user_con_profile].email,
      source: args[:stripe_token]
    )

    charge = Stripe::Charge.create(
      customer: customer.id,
      amount: current_price.fractional,
      description: "#{ticket_type.name} for #{ctx[:convention].name}",
      currency: current_price.currency.iso_code.downcase
    )

    ticket = ctx[:user_con_profile].create_ticket!(
      ticket_type: ticket_type,
      payment_amount: current_price,
      payment_note: "Paid via Stripe on #{Time.at(charge.created)} (Charge ID #{charge.id})",
      charge_id: charge.id
    )

    TicketsMailer.purchased(ticket).deliver_now

    { ticket: ticket }
  end
end
