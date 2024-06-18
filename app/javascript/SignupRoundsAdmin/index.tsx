import { Route, Routes } from 'react-router';
import SignupRoundsAdminPage from './SignupRoundsAdminPage';
import RankedChoiceSignupDecisionsPage from './RankedChoiceSignupDecisionsPage';

function SignupRoundsAdmin() {
  return (
    <Routes>
      <Route path=":id/results" element={<RankedChoiceSignupDecisionsPage />} />
      <Route index element={<SignupRoundsAdminPage />} />
    </Routes>
  );
}

export default SignupRoundsAdmin;
