import React from 'react';
import { useQuery } from 'react-apollo-hooks';

import { AccountFormContentQuery } from './queries.gql';
import parsePageContent from '../CmsPage/parsePageContent';

function AccountFormContent() {
  const { data, loading, error } = useQuery(AccountFormContentQuery);

  if (error || loading) {
    return <></>;
  }

  return parsePageContent(data.accountFormContentHtml);
}

export default AccountFormContent;
