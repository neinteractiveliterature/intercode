# frozen_string_literal: true
class Mutations::CreateTeamMember < Mutations::BaseMutation
  field :converted_signups, [Types::SignupType], null: false
  field :move_results, [Types::SignupMoveResultType], null: false
  field :team_member, Types::TeamMemberType, null: false
  field :ticket, Types::TicketType, null: true

  argument :event_id, ID, required: false, camelize: true
  argument :provide_ticket_type_id, ID, required: false, camelize: true
  argument :team_member, Types::TeamMemberInputType, required: true, camelize: false
  argument :user_con_profile_id, ID, required: false, camelize: true

  attr_reader :event

  define_authorization_check do |args|
    @event = convention.events.find(args[:event_id])
    policy(TeamMember.new(event:)).create?
  end

  def resolve(**args)
    user_con_profile = convention.user_con_profiles.find(args[:user_con_profile_id])
    result =
      CreateTeamMemberService.new(
        event:,
        user_con_profile:,
        team_member_attrs: args[:team_member].to_h,
        provide_ticket_type_id: args[:provide_ticket_type_id]
      ).call!

    {
      team_member: result.team_member,
      ticket: result.ticket,
      converted_signups: result.converted_signups,
      move_results: result.move_results
    }
  end
end
