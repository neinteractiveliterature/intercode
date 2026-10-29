import { useState } from 'react';

import { Form, redirect, useActionData, useNavigation } from 'react-router';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import { buildPageInputFromFormData } from './buildPageInput';
import CmsPageForm, { PageFormFields } from './CmsPageForm';
import usePageTitle from '../../usePageTitle';
import { CreatePageDocument } from './mutations.generated';
import { useCmsPagesAdminLoader } from './loaders';
import { apolloClientContext } from 'AppContexts';
import type { Route } from './+types/NewCmsPage';

export const clientAction = async ({ context, request }: Route.ClientActionArgs) => {
  const client = context.get(apolloClientContext);
  const formData = await request.formData();

  try {
    await client.mutate({
      mutation: CreatePageDocument,
      variables: {
        page: buildPageInputFromFormData(formData),
      },
    });
  } catch (e) {
    return e;
  }
  await client.resetStore();

  return redirect('/cms_pages');
};

function NewCmsPage() {
  const data = useCmsPagesAdminLoader();
  const [page, setPage] = useState<PageFormFields>({
    hidden_from_search: false,
  });
  const navigation = useNavigation();
  const createError = useActionData<typeof clientAction>();
  const createInProgress = navigation.state !== 'idle';

  usePageTitle('New page');

  return (
    <>
      <Form action="." method="POST">
        <CmsPageForm page={page} onChange={setPage} cmsLayouts={data.cmsParent.cmsLayouts} cmsParent={data.cmsParent} />

        <ErrorDisplay graphQLError={createError} />

        <input
          type="submit"
          className="btn btn-primary"
          value="Create page"
          disabled={createInProgress}
          aria-label="Create page"
        />
      </Form>
    </>
  );
}

export default NewCmsPage;
