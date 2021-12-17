import { Routes, Route, Navigate } from 'react-router-dom';

import MyProfileDisplay from './MyProfileDisplay';
import MyProfileForm from './MyProfileForm';
import useLoginRequired from '../Authentication/useLoginRequired';

function MyProfile(): JSX.Element {
  const loginRequired = useLoginRequired();

  if (loginRequired) {
    return <></>;
  }

  return (
    <Routes>
      <Route path="/my_profile/edit_bio" element={<Navigate to="/my_profile/edit" replace />} />
      <Route path="/my_profile/edit" element={<MyProfileForm />} />
      <Route path="/my_profile/setup" element={<MyProfileForm initialSetup />} />
      <Route path="/my_profile" element={<MyProfileDisplay />} />
    </Routes>
  );
}

export default MyProfile;
