export default function buildStaffPositionInput(staffPosition) {
  return {
    name: staffPosition.name,
    email: staffPosition.email,
    email_aliases: staffPosition.email_aliases,
    visible: staffPosition.visible,
    user_con_profile_ids: (staffPosition.user_con_profiles || []).map((
      (userConProfile) => userConProfile.id
    )),
    cc_addresses: staffPosition.cc_addresses,
  };
}
