export function teamMemberSortKey(teamMember) {
  return `${teamMember.user_con_profile.last_name}-${teamMember.user_con_profile.name_without_nickname}`;
}

export function sortTeamMembers(event) {
  return [...event.team_members]
    .sort((a, b) => teamMemberSortKey(a).localeCompare(teamMemberSortKey(b), { sensitivity: 'base' }));
}

export default function teamMembersForDisplay(event) {
  return sortTeamMembers(event).filter((teamMember) => teamMember.display_team_member);
}
