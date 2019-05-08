import React from 'react';
import CadmusNavbarAdminApp from 'cadmus-navbar-admin/src';
import { useApolloClient } from 'react-apollo-hooks';

import Client from './Client';

const NavigationItemsAdmin = () => {
  const apolloClient = useApolloClient();
  const navbarAdminClient = new Client(apolloClient);

  return <CadmusNavbarAdminApp client={navbarAdminClient} />;
};

export default NavigationItemsAdmin;
