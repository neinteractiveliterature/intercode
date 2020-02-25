import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import MyProfileDisplay from './MyProfileDisplay';
import MyProfileForm from './MyProfileForm';
import useLoginRequired from '../Authentication/useLoginRequired';

function MyProfile() {
  const loginRequired = useLoginRequired();

  if (loginRequired) {
    return <></>;
  }

  return (
    <Switch>
      <Route path="/my_profile/edit_bio">
        <Redirect to="/my_profile/edit" />
      </Route>
      <Route path="/my_profile/edit"><MyProfileForm /></Route>
      <Route path="/my_profile/setup"><MyProfileForm initialSetup /></Route>
      <Route path="/my_profile"><MyProfileDisplay /></Route>
    </Switch>
  );
}

export default MyProfile;
