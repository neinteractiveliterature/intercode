export function teamMemberSortKey(
  teamMember: {
    user_con_profile: { last_name?: string, name_without_nickname?: string }
    display_team_member?: boolean,
  },
) {
  return `${teamMember.user_con_profile.last_name}-${teamMember.user_con_profile.name_without_nickname}`;
}

export function sortTeamMembers(
  event: { team_members: Parameters<typeof teamMemberSortKey>[0][] },
) {
  return [...event.team_members]
    .sort((a, b) => teamMemberSortKey(a)
      .localeCompare(teamMemberSortKey(b), undefined, { sensitivity: 'base' }));
}

export default function teamMembersForDisplay(event: Parameters<typeof sortTeamMembers>[0]) {
  return sortTeamMembers(event).filter((teamMember) => teamMember.display_team_member);
}
