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
      <Route path="/my_profile/edit">
        <MyProfileForm />
      </Route>
      <Route path="/my_profile/setup">
        <MyProfileForm initialSetup />
      </Route>
      <Route path="/my_profile">
        <MyProfileDisplay />
      </Route>
    </Routes>
  );
}

export default MyProfile;
