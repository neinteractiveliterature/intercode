import { useQuery } from '@apollo/client';
import { AccountFormContentQueryDocument } from './queries.generated';
import BlockPartial from 'UIComponents/BlockPartial';
import { CmsPartialBlockName } from 'graphqlTypes.generated';

function AccountFormContent(): React.JSX.Element {
  const { data, loading, error } = useQuery(AccountFormContentQueryDocument);

  if (error || loading || !data) {
    return <></>;
  }

  return (
    <BlockPartial
      name={CmsPartialBlockName.AccountFormText}
      blockPartial={data.rootSite.blockPartial}
      currentAbilityCanCreate={data.currentAbility.can_create_cms_partials}
    />
  );
}

export default AccountFormContent;
