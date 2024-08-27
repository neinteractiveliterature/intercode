import { useState } from 'react';
import { ApolloError } from '@apollo/client';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import {
  ActionFunction,
  Form,
  redirect,
  useActionData,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from 'react-router-dom';
import { buildPageInputFromFormData } from './buildPageInput';
import CmsPageForm from './CmsPageForm';
import usePageTitle from '../../usePageTitle';
import { singleCmsPageAdminLoader, SingleCmsPageAdminLoaderResult } from './loaders';
import { UpdatePageDocument } from './mutations.generated';
import { client } from '../../useIntercodeApolloClient';

export const action: ActionFunction = async ({ params: { id }, request }) => {
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

export const loader = singleCmsPageAdminLoader;

function EditCmsPageForm() {
  const { data, page: initialPage } = useLoaderData() as SingleCmsPageAdminLoaderResult;
  const { cmsParent } = data;
  const [page, setPage] = useState(initialPage);
  const [searchParams] = useSearchParams();
  const navigation = useNavigation();
  const updateError = useActionData();

  usePageTitle(`Edit “${initialPage.name}”`);

  return (
    <>
      <Form method="PATCH" action=".">
        <CmsPageForm page={page} onChange={setPage} cmsLayouts={cmsParent.cmsLayouts} cmsParent={cmsParent} />

        <ErrorDisplay graphQLError={updateError as ApolloError} />

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

export const Component = EditCmsPageForm;
