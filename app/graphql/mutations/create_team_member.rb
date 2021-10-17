# frozen_string_literal: true
class Mutations::CreateTeamMember < Mutations::BaseMutation
  field :team_member, Types::TeamMemberType, null: false
  field :ticket, Types::TicketType, null: true
  field :converted_signups, [Types::SignupType], null: false
  field :move_results, [Types::SignupMoveResultType], null: false

  argument :event_id,
           Integer,
           deprecation_reason:
             "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
           required: false,
           camelize: false
  argument :transitional_event_id, ID, required: false, camelize: true
  argument :user_con_profile_id,
           Integer,
           deprecation_reason:
             "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
           required: false,
           camelize: false
  argument :transitional_user_con_profile_id, ID, required: false, camelize: true
  argument :team_member, Types::TeamMemberInputType, required: true, camelize: false
  argument :provide_ticket_type_id,
           Integer,
           deprecation_reason:
             "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
           required: false,
           camelize: false
  argument :transitional_provide_ticket_type_id, ID, required: false, camelize: true

  attr_reader :event

  define_authorization_check do |args|
    @event = convention.events.find(args[:transitional_event_id] || args[:event_id])
    policy(TeamMember.new(event: event)).create?
  end

  def resolve(**args)
    user_con_profile =
      convention.user_con_profiles.find(args[:transitional_user_con_profile_id] || args[:user_con_profile_id])
    result =
      CreateTeamMemberService.new(
        event: event,
        user_con_profile: user_con_profile,
        team_member_attrs: args[:team_member].to_h,
        provide_ticket_type_id: args[:transitional_provide_ticket_type_id] || args[:provide_ticket_type_id]
      ).call!

    {
      team_member: result.team_member,
      ticket: result.ticket,
      converted_signups: result.converted_signups,
      move_results: result.move_results
    }
  end
end
