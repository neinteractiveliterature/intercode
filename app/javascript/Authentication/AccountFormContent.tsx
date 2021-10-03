import parseCmsContent from '../parseCmsContent';
import { useAccountFormContentQuery } from './queries.generated';

function AccountFormContent(): JSX.Element {
  const { data, loading, error } = useAccountFormContentQuery();

  if (error || loading) {
    return <></>;
  }

  return <>{parseCmsContent(data?.accountFormContentHtml ?? '').bodyComponents}</>;
}

export default AccountFormContent;
