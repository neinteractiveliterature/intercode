import { index, route } from '@react-router/dev/routes';

export default route('/my_profile', 'MyProfile/loginGuard.ts', [
  route('edit_bio', 'MyProfile/redirectToEdit.ts'),
  route('edit', 'MyProfile/MyProfileForm.tsx'),
  route('setup', 'MyProfile/MyProfileForm.tsx', { id: 'MyProfile/MyProfileForm#2' }),
  index('MyProfile/MyProfileDisplay.tsx'),
]);
