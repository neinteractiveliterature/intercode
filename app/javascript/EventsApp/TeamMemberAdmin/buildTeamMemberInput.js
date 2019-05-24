function buildTeamMemberInput(teamMember) {
  return {
    display_team_member: teamMember.display_team_member,
    show_email: teamMember.show_email,
    receive_con_email: teamMember.receive_con_email,
    receive_signup_email: teamMember.receive_signup_email,
  };
}

export default buildTeamMemberInput;
