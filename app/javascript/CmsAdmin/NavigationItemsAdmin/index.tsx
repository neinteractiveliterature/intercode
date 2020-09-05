import React, { useMemo } from 'react';
// @ts-expect-error
import CadmusNavbarAdminApp from 'cadmus-navbar-admin/src';
import { useApolloClient } from '@apollo/client';

import Client from './Client';
import usePageTitle from '../../usePageTitle';

const NavigationItemsAdmin = () => {
  const apolloClient = useApolloClient();
  const navbarAdminClient = useMemo(() => new Client(apolloClient), [apolloClient]);

  usePageTitle('CMS Navigation');

  return <CadmusNavbarAdminApp client={navbarAdminClient} />;
};

export default NavigationItemsAdmin;
