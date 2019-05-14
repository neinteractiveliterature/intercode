import React from 'react';
import { Switch, Route } from 'react-router-dom';

import EditBio from './EditBio';
import MyProfileDisplay from './MyProfileDisplay';
import MyProfileForm from './MyProfileForm';

function MyProfile() {
  return (
    <Switch>
      <Route path="/my_profile/edit_bio" component={EditBio} />
      <Route path="/my_profile/edit" component={MyProfileForm} />
      <Route path="/my_profile" component={MyProfileDisplay} />
    </Switch>
  );
}

export default MyProfile;
