module TeamMembersHelper
  def team_member_form(team_member)
    app_component 'TeamMemberForm',
      baseUrl: event_team_members_url(team_member.event),
      eventId: team_member.event.id,
      teamMemberId: team_member.id
  end
end
