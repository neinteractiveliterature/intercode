import React from 'react';
import { useQuery } from 'react-apollo-hooks';

import { AccountFormContentQuery } from './queries.gql';
import parseCmsContent from '../parseCmsContent';

function AccountFormContent() {
  const { data, loading, error } = useQuery(AccountFormContentQuery);

  if (error || loading) {
    return <></>;
  }

  return parseCmsContent(data.accountFormContentHtml).bodyComponents;
}

export default AccountFormContent;
