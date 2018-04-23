import React from 'react';
import CadmusNavbarAdminApp from 'cadmus-navbar-admin';
import { ApolloConsumer } from 'react-apollo';
import Client from './Client';

const NavigationItemsAdmin = () => (
  <ApolloConsumer>
    {apolloClient => (
      <CadmusNavbarAdminApp client={new Client(apolloClient)} />
    )}
  </ApolloConsumer>
);

export default NavigationItemsAdmin;
