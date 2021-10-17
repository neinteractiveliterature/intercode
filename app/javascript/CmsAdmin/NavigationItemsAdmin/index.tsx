import { useMemo } from 'react';
import CadmusNavbarAdminApp from 'cadmus-navbar-admin';
import { useApolloClient } from '@apollo/client';
import 'cadmus-navbar-admin/styles/cadmus-navbar-admin.css';

import Client from './Client';
import usePageTitle from '../../usePageTitle';

export default function NavigationItemsAdmin(): JSX.Element {
  const apolloClient = useApolloClient();
  const navbarAdminClient = useMemo(() => new Client(apolloClient), [apolloClient]);

  usePageTitle('CMS Navigation');

  return <CadmusNavbarAdminApp client={navbarAdminClient} />;
}
