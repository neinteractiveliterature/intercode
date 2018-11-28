function buildTeamMemberInput(teamMember) {
  return {
    display: teamMember.display,
    show_email: teamMember.show_email,
    receive_con_email: teamMember.receive_con_email,
    receive_signup_email: teamMember.receive_signup_email,
  };
}

export default buildTeamMemberInput;
