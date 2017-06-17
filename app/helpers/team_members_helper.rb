module TeamMembersHelper
  def team_member_form(team_member)
    react_component 'TeamMemberForm', {
      baseUrl: event_team_members_url(team_member.event),
      initialTeamMember: team_member.as_json,
      teamMemberName: team_member.event.team_member_name
    }
  end
end
