import { useQuery } from '@apollo/client';
import { parseCmsContent } from '../parseCmsContent';
import { AccountFormContentQueryDocument } from './queries.generated';

function AccountFormContent(): JSX.Element {
  const { data, loading, error } = useQuery(AccountFormContentQueryDocument);

  if (error || loading) {
    return <></>;
  }

  return <>{parseCmsContent(data?.accountFormContentHtml ?? '').bodyComponents}</>;
}

export default AccountFormContent;
