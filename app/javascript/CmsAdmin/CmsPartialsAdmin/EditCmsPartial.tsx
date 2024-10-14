import { useState } from 'react';
import { ApolloError } from '@apollo/client';
import { ActionFunction, Form, redirect, useActionData, useLoaderData, useNavigation } from 'react-router';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import { buildPartialInputFromFormData } from './buildPartialInput';
import CmsPartialForm from './CmsPartialForm';
import usePageTitle from '../../usePageTitle';
import { singleCmsPartialAdminLoader, SingleCmsPartialAdminLoaderResult } from './loaders';
import { UpdatePartialDocument } from './mutations.generated';
import { client } from '../../useIntercodeApolloClient';

export const action: ActionFunction = async ({ params: { id }, request }) => {
  const formData = await request.formData();

  try {
    await client.mutate({
      mutation: UpdatePartialDocument,
      variables: {
        id: id ?? '',
        cmsPartial: buildPartialInputFromFormData(formData),
      },
    });
  } catch (e) {
    return e;
  }
  await client.resetStore();

  return redirect(formData.get('destination')?.toString() ?? '/cms_partials');
};

export const loader = singleCmsPartialAdminLoader;

function EditCmsPartialForm() {
  const { partial: initialPartial } = useLoaderData() as SingleCmsPartialAdminLoaderResult;
  const [partial, setPartial] = useState(initialPartial);
  const navigation = useNavigation();
  const updateError = useActionData();

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

export const Component = EditCmsPartialForm;
