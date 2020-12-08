import { useMemo } from 'react';
// @ts-expect-error
import CadmusNavbarAdminApp from 'cadmus-navbar-admin/src';
import { useApolloClient } from '@apollo/client';

import Client from './Client';
import usePageTitle from '../../usePageTitle';
import DndWrapper from '../../DndWrapper';

const NavigationItemsAdmin = () => {
  const apolloClient = useApolloClient();
  const navbarAdminClient = useMemo(() => new Client(apolloClient), [apolloClient]);

  usePageTitle('CMS Navigation');

  return <CadmusNavbarAdminApp client={navbarAdminClient} />;
};

export default DndWrapper(NavigationItemsAdmin);
