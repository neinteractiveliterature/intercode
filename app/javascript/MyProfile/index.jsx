import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import EditBio from './EditBio';
import MyProfileDisplay from './MyProfileDisplay';
import MyProfileForm from './MyProfileForm';

function MyProfile({ basename }) {
  return (
    <BrowserRouter basename={basename}>
      <Switch>
        <Route path="/edit_bio" component={EditBio} />
        <Route path="/edit" component={MyProfileForm} />
        <Route path="/" component={MyProfileDisplay} />
      </Switch>
    </BrowserRouter>
  );
}

MyProfile.propTypes = {
  basename: PropTypes.string.isRequired,
};

export default MyProfile;
