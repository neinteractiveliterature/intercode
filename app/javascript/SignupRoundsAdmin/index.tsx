import { Route, Routes } from 'react-router';
import SignupRoundsAdminPage from './SignupRoundsAdminPage';

function SignupRoundsAdmin() {
  return (
    <Routes>
      <Route path=":id/results" element={<></>} />
      <Route index element={<SignupRoundsAdminPage />} />
    </Routes>
  );
}

export default SignupRoundsAdmin;
