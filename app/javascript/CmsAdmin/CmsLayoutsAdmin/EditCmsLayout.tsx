import { useState } from 'react';
import { ApolloError } from '@apollo/client';
import { Form, redirect, useNavigation } from 'react-router';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import { buildLayoutInputFromFormData } from './buildLayoutInput';
import CmsLayoutForm from './CmsLayoutForm';
import usePageTitle from '../../usePageTitle';
import { UpdateLayoutDocument } from './mutations.generated';
import { Route } from './+types/EditCmsLayout';
import { CmsLayoutAdminQueryDocument } from './queries.generated';
import { apolloClientContext } from 'AppContexts';

export async function action({ params: { id }, request, context }: Route.ActionArgs) {
  const formData = await request.formData();

  try {
    await context.get(apolloClientContext).mutate({
      mutation: UpdateLayoutDocument,
      variables: {
        id: id ?? '',
        cmsLayout: buildLayoutInputFromFormData(formData),
      },
    });
  } catch (e) {
    return e;
  }
  await context.get(apolloClientContext).resetStore();

  return redirect(formData.get('destination')?.toString() ?? '/cms_layouts');
}

export async function loader({ context, params: { id } }: Route.LoaderArgs) {
  const { data } = await context
    .get(apolloClientContext)
    .query({ query: CmsLayoutAdminQueryDocument, variables: { id } });
  return data;
}

function EditCmsLayout({
  loaderData: {
    cmsParent: { cmsLayout: initialLayout },
  },
  actionData: updateError,
}: Route.ComponentProps) {
  const [layout, setLayout] = useState(initialLayout);
  const navigation = useNavigation();

  usePageTitle(`Editing “${initialLayout.name}”`);

  return (
    <>
      <Form action="." method="PATCH">
        <CmsLayoutForm layout={layout} onChange={setLayout} />

        <ErrorDisplay graphQLError={updateError as ApolloError} />

        <input
          type="submit"
          className="btn btn-primary"
          value="Save changes"
          disabled={navigation.state !== 'idle'}
          aria-label="Save changes"
        />
      </Form>
    </>
  );
}

export default EditCmsLayout;
