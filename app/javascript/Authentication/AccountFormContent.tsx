import { useParseCmsContent } from '../parseCmsContent';
import { useAccountFormContentQuery } from './queries.generated';

function AccountFormContent(): JSX.Element {
  const { data, loading, error } = useAccountFormContentQuery();
  const parseCmsContent = useParseCmsContent();

  if (error || loading) {
    return <></>;
  }

  return <>{parseCmsContent(data?.accountFormContentHtml ?? '').bodyComponents}</>;
}

export default AccountFormContent;
