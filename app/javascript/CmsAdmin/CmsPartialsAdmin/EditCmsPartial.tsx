import { useState } from 'react';
import { ApolloError } from '@apollo/client';
import { Form, redirect, useNavigation } from 'react-router';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import { buildPartialInputFromFormData } from './buildPartialInput';
import CmsPartialForm from './CmsPartialForm';
import usePageTitle from '../../usePageTitle';
import { UpdatePartialDocument } from './mutations.generated';
import { Route } from './+types/EditCmsPartial';
import { CmsPartialAdminQueryDocument } from './queries.generated';

export async function action({ params: { id }, request, context }: Route.ActionArgs) {
  const formData = await request.formData();

  try {
    await context.client.mutate({
      mutation: UpdatePartialDocument,
      variables: {
        id: id ?? '',
        cmsPartial: buildPartialInputFromFormData(formData),
      },
    });
  } catch (e) {
    return e;
  }
  await context.client.resetStore();

  return redirect(formData.get('destination')?.toString() ?? '/cms_partials');
}

export async function loader({ context, params: { id } }: Route.LoaderArgs) {
  const { data } = await context.client.query({ query: CmsPartialAdminQueryDocument, variables: { id } });
  return data;
}

function EditCmsPartialForm({
  loaderData: {
    cmsParent: { cmsPartial: initialPartial },
  },
  actionData: updateError,
}: Route.ComponentProps) {
  const [partial, setPartial] = useState(initialPartial);
  const navigation = useNavigation();

  usePageTitle(`Editing “${initialPartial.name}”`);

  return (
    <>
      <Form action="." method="PATCH">
        <CmsPartialForm partial={partial} onChange={setPartial} />

        <ErrorDisplay graphQLError={updateError as ApolloError} />

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

export default EditCmsPartialForm;
