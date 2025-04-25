import { useState } from 'react';
import { ApolloError } from '@apollo/client';
import { Form, redirect, useNavigation } from 'react-router';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import { buildPageInputFromFormData } from './buildPageInput';
import CmsPageForm, { PageFormFields } from './CmsPageForm';
import usePageTitle from '../../usePageTitle';
import { CreatePageDocument } from './mutations.generated';
import { Route } from './+types/NewCmsPage';
import { useCmsPagesAdminLoader } from './route';
import { apolloClientContext } from 'AppContexts';

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();

  try {
    await context.get(apolloClientContext).mutate({
      mutation: CreatePageDocument,
      variables: {
        page: buildPageInputFromFormData(formData),
      },
    });
  } catch (e) {
    return e;
  }
  await context.get(apolloClientContext).resetStore();

  return redirect('/cms_pages');
}

function NewCmsPage({ actionData: createError }: Route.ComponentProps) {
  const data = useCmsPagesAdminLoader();
  const [page, setPage] = useState<PageFormFields>({
    hidden_from_search: false,
  });
  const navigation = useNavigation();
  const createInProgress = navigation.state !== 'idle';

  usePageTitle('New page');

  return (
    <>
      <Form action="." method="POST">
        <CmsPageForm
          page={page}
          onChange={setPage}
          cmsLayouts={data.cmsParent.cmsLayouts}
          defaultLayout={data.cmsParent.defaultLayout}
        />

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

export default NewCmsPage;
