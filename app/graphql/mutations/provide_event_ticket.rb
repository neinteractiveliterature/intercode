Mutations::ProvideEventTicket = GraphQL::Relay::Mutation.define do
  name "ProvideEventTicket"
  return_field :ticket, Types::TicketType

  input_field :event_id, !types.Int
  input_field :ticket_type_id, !types.Int
  input_field :user_con_profile_id, !types.Int

  resolve MutationErrorHandler.new(
    ->(_obj, args, ctx) {
      event = ctx[:convention].events.find(args[:event_id])
      ticket_type = ctx[:convention].ticket_types.find(args[:ticket_type_id])
      user_con_profile = ctx[:convention].user_con_profiles.find(args[:user_con_profile_id])

      result = ProvideEventTicketService.new(event, user_con_profile, ticket_type).call!

      { ticket: result.ticket }
    }
  )
end
