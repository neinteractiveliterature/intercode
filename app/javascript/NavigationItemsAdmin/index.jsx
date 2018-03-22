import React from 'react';
import PropTypes from 'prop-types';
import CadmusNavbarAdminApp from 'cadmus-navbar-admin';
import RESTClient from 'cadmus-navbar-admin/lib/RESTClient';

const NavigationItemsAdmin = ({ baseUrl, pagesUrl }) => {
  const client = new RESTClient({ baseUrl, pagesUrl });

  return (
    <CadmusNavbarAdminApp client={client} />
  );
};

NavigationItemsAdmin.propTypes = {
  baseUrl: PropTypes.string.isRequired,
  pagesUrl: PropTypes.string.isRequired,
};

export default NavigationItemsAdmin;
