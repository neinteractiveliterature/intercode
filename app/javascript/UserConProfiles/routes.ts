import { index, route } from '@react-router/dev/routes';
import { NamedRoute } from '../NamedRoute';

export default route('/user_con_profiles', 'UserConProfiles/attendeesGuard.ts', [
  route(':id', 'UserConProfiles/userConProfileLoader.ts', { id: NamedRoute.AdminUserConProfile }, [
    route('admin_ticket', 'UserConProfiles/adminTicketRoute.ts', [
      route('new', 'UserConProfiles/NewTicket.tsx'),
      route('edit', 'UserConProfiles/EditTicket.tsx'),
    ]),
    route('edit', 'UserConProfiles/EditUserConProfile.tsx'),
    index('UserConProfiles/UserConProfileAdminDisplay.tsx'),
  ]),
  route('', 'UserConProfiles/AttendeesPage.tsx', [route('new', 'UserConProfiles/AddAttendeeModal.tsx')]),
]);
