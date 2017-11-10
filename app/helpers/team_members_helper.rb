module TeamMembersHelper
  def team_member_form(team_member)
    react_component 'TeamMemberForm', {
      baseUrl: event_team_members_url(team_member.event),
      eventId: team_member.event.id,
      authenticityToken: graphql_authenticity_token,
      teamMemberId: team_member.id
    }
  end
end
