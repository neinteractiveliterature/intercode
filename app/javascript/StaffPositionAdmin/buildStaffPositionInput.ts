import { StaffPosition, StaffPositionInput } from '../graphqlTypes.generated';

export default function buildStaffPositionInput(
  staffPosition: Pick<StaffPosition, 'name' | 'email' | 'email_aliases' | 'visible' | 'cc_addresses'> & {
    user_con_profiles?: { id: string }[] | null;
  },
): StaffPositionInput {
  return {
    name: staffPosition.name,
    email: staffPosition.email,
    email_aliases: staffPosition.email_aliases,
    visible: staffPosition.visible,
    transitionalUserConProfileIds: (staffPosition.user_con_profiles || []).map((userConProfile) => userConProfile.id),
    cc_addresses: staffPosition.cc_addresses,
  };
}
