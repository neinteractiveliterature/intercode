import { useState } from 'react';
import { ApolloError } from '@apollo/client';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import { Form, redirect, useNavigation, useSearchParams } from 'react-router';
import { buildPageInputFromFormData } from './buildPageInput';
import CmsPageForm from './CmsPageForm';
import usePageTitle from '../../usePageTitle';
import { UpdatePageDocument } from './mutations.generated';
import { Route } from './+types/EditCmsPage';
import { CmsPageAdminQueryDocument } from './queries.generated';

export async function action({ params: { id }, request, context }: Route.ActionArgs) {
  const formData = await request.formData();

  try {
    await context.client.mutate({
      mutation: UpdatePageDocument,
      variables: {
        id: id ?? '',
        page: buildPageInputFromFormData(formData),
      },
    });
  } catch (e) {
    return e;
  }
  await context.client.resetStore();

  return redirect(formData.get('destination')?.toString() ?? '/cms_pages');
}

export async function loader({ context, params: { id } }: Route.LoaderArgs) {
  const { data } = await context.client.query({ query: CmsPageAdminQueryDocument, variables: { id } });
  return data;
}

function EditCmsPageForm({ loaderData: data, actionData: updateError }: Route.ComponentProps) {
  const { cmsParent } = data;
  const initialPage = cmsParent.cmsPage;
  const [page, setPage] = useState(initialPage);
  const [searchParams] = useSearchParams();
  const navigation = useNavigation();

  usePageTitle(`Edit “${initialPage.name}”`);

  return (
    <>
      <Form method="PATCH" action=".">
        <CmsPageForm
          page={page}
          onChange={setPage}
          cmsLayouts={cmsParent.cmsLayouts}
          defaultLayout={cmsParent.defaultLayout}
        />

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

export default EditCmsPageForm;
