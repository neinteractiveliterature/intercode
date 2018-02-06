Mutations::CreateTeamMember = GraphQL::Relay::Mutation.define do
  name 'CreateTeamMember'
  return_field :team_member, !Types::TeamMemberType
  return_field :ticket, Types::TicketType

  input_field :event_id, !types.Int
  input_field :user_con_profile_id, !types.Int
  input_field :team_member, !Types::TeamMemberInputType
  input_field :provide_ticket_type_id, types.Int

  resolve MutationErrorHandler.new(
    ->(_obj, args, ctx) {
      team_member = nil
      ticket = nil

      ActiveRecord::Base.transaction do
        event = ctx[:convention].events.find(args[:event_id])
        user_con_profile = ctx[:convention].user_con_profiles.find(args[:user_con_profile_id])

        team_member = event.team_members.create!(
          args[:team_member].to_h.merge(
            user_con_profile: user_con_profile,
            updated_by: ctx[:user_con_profile].user
          )
        )

        if args[:provide_ticket_type_id]
          ticket_type = ctx[:convention].ticket_types.find(args[:provide_ticket_type_id])
          result = ProvideEventTicketService.new(event, user_con_profile, ticket_type).call!
          ticket = result.ticket
        end
      end

      { team_member: team_member, ticket: ticket }
    }
  )
end
