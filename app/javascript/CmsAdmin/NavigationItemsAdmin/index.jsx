import React from 'react';
import CadmusNavbarAdminApp from 'cadmus-navbar-admin/src';
import { useApolloClient } from 'react-apollo-hooks';

import Client from './Client';
import { NavigationItemsAdminQuery } from './queries.gql';
import useQuerySuspended from '../../useQuerySuspended';
import useValueUnless from '../../useValueUnless';
import usePageTitle from '../../usePageTitle';

const NavigationItemsAdmin = () => {
  const { data, error } = useQuerySuspended(NavigationItemsAdminQuery);
  const apolloClient = useApolloClient();
  const navbarAdminClient = new Client(apolloClient);

  usePageTitle('CMS Navigation', useValueUnless(() => data.convention, error));

  return <CadmusNavbarAdminApp client={navbarAdminClient} />;
};

export default NavigationItemsAdmin;
