import { TeamMemberInput } from '../../graphqlTypes.generated';
import { TeamMembersQueryData } from './queries.generated';

function buildTeamMemberInput(
  teamMember: TeamMembersQueryData['convention']['event']['team_members'][0],
): TeamMemberInput {
  return {
    display_team_member: teamMember.display_team_member,
    show_email: teamMember.show_email,
    receive_con_email: teamMember.receive_con_email,
    receive_signup_email: teamMember.receive_signup_email,
  };
}

export default buildTeamMemberInput;
