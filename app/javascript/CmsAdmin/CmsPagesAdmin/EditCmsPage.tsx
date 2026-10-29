import { useState } from 'react';

import { ErrorDisplay } from '@neinteractiveliterature/litform';

import { Form, redirect, useActionData, useLoaderData, useNavigation, useSearchParams } from 'react-router';
import { buildPageInputFromFormData } from './buildPageInput';
import CmsPageForm from './CmsPageForm';
import usePageTitle from '../../usePageTitle';
import { singleCmsPageAdminLoader } from './loaders';
import { UpdatePageDocument } from './mutations.generated';
import { apolloClientContext } from '../../AppContexts';
import type { Route } from './+types/EditCmsPage';

export const clientAction = async ({ params: { id }, request, context }: Route.ClientActionArgs) => {
  const client = context.get(apolloClientContext);
  const formData = await request.formData();

  try {
    await client.mutate({
      mutation: UpdatePageDocument,
      variables: {
        id: id ?? '',
        page: buildPageInputFromFormData(formData),
      },
    });
  } catch (e) {
    return e;
  }
  await client.resetStore();

  return redirect(formData.get('destination')?.toString() ?? '/cms_pages');
};

export const clientLoader = singleCmsPageAdminLoader;

function EditCmsPageForm() {
  const { data, page: initialPage } = useLoaderData<typeof clientLoader>();
  const { cmsParent } = data;
  const [page, setPage] = useState(initialPage);
  const [searchParams] = useSearchParams();
  const navigation = useNavigation();
  const updateError = useActionData<typeof clientAction>();

  usePageTitle(`Edit “${initialPage.name}”`);

  return (
    <>
      <Form method="PATCH" action=".">
        <CmsPageForm page={page} onChange={setPage} cmsLayouts={cmsParent.cmsLayouts} cmsParent={cmsParent} />

        <ErrorDisplay graphQLError={updateError} />

        <input type="hidden" name="destination" value={searchParams.get('destination') ?? '/cms_pages'} />

        <input
          type="submit"
          className="btn btn-primary"
          value="Save changes"
          aria-label="Save changes"
          disabled={navigation.state !== 'idle'}
        />
      </Form>
    </>
  );
}

export default EditCmsPageForm;
