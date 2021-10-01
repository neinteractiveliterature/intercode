type TeamMemberForSorting = {
  user_con_profile: { last_name?: string | null; name_without_nickname?: string | null };
};

export function teamMemberSortKey(teamMember: TeamMemberForSorting): string {
  return `${teamMember.user_con_profile.last_name}-${teamMember.user_con_profile.name_without_nickname}`;
}

export function sortTeamMembers<TeamMemberType extends TeamMemberForSorting>(event: {
  team_members: TeamMemberType[];
}): TeamMemberType[] {
  return [...event.team_members].sort((a, b) =>
    teamMemberSortKey(a).localeCompare(teamMemberSortKey(b), undefined, { sensitivity: 'base' }),
  );
}

type TeamMemberForDisplay = TeamMemberForSorting & {
  display_team_member: boolean;
};

export default function teamMembersForDisplay<TeamMemberType extends TeamMemberForDisplay>(event: {
  team_members: TeamMemberType[];
}): TeamMemberType[] {
  return sortTeamMembers(event).filter((teamMember) => teamMember.display_team_member);
}
