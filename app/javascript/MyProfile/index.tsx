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
      <Route path="edit_bio" element={<Navigate to="./edit" replace />} />
      <Route path="edit" element={<MyProfileForm />} />
      <Route path="setup" element={<MyProfileForm initialSetup />} />
      <Route path="" element={<MyProfileDisplay />} />
    </Routes>
  );
}

export default MyProfile;
