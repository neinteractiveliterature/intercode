import { useState } from 'react';
import { ApolloError } from '@apollo/client';
import { ActionFunction, Form, redirect, useActionData, useNavigation } from 'react-router';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import { buildPageInputFromFormData } from './buildPageInput';
import CmsPageForm, { PageFormFields } from './CmsPageForm';
import usePageTitle from '../../usePageTitle';
import { CreatePageDocument } from './mutations.generated';
import { useCmsPagesAdminLoader } from './loaders';
import { client } from '../../useIntercodeApolloClient';

export const action: ActionFunction = async ({ request }) => {
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
  const createError = useActionData();
  const createInProgress = navigation.state !== 'idle';

  usePageTitle('New page');

  return (
    <>
      <Form action="." method="POST">
        <CmsPageForm page={page} onChange={setPage} cmsLayouts={data.cmsParent.cmsLayouts} cmsParent={data.cmsParent} />

        <ErrorDisplay graphQLError={createError as ApolloError} />

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

export const Component = NewCmsPage;
