import React from 'react';

import parseCmsContent from '../parseCmsContent';
import { useAccountFormContentQueryQuery } from './queries.generated';

function AccountFormContent() {
  const { data, loading, error } = useAccountFormContentQueryQuery();

  if (error || loading) {
    return <></>;
  }

  return parseCmsContent(data?.accountFormContentHtml ?? '').bodyComponents;
}

export default AccountFormContent;
