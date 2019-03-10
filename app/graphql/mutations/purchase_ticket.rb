class Mutations::PurchaseTicket < Mutations::BaseMutation
  field :ticket, Types::TicketType, null: false

  argument :ticket_type_id, Integer, required: true, camelize: false
  argument :stripe_token, String, required: true, camelize: false

  def resolve(**args)
    ticket_type = convention.ticket_types.find(args[:ticket_type_id])

    service = PurchaseTicketService.new(user_con_profile, ticket_type, args[:stripe_token])
    result = service.call

    if result.failure?
      err = CivilService::ServiceFailure.new(service, result)
      raise BetterRescueMiddleware::UnloggedError, err.message if result.card_error
      raise err
    end

    { ticket: result.ticket }
  end
end
