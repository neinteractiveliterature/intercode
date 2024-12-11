import { useState } from 'react';
import { ActionFunction, Form, redirect, useActionData, useNavigation } from 'react-router';
import { ApolloError } from '@apollo/client';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import { buildPartialInputFromFormData } from './buildPartialInput';
import CmsPartialForm, { CmsPartialFormFields } from './CmsPartialForm';
import usePageTitle from '../../usePageTitle';
import { client } from '../../useIntercodeApolloClient';
import { CreatePartialDocument } from './mutations.generated';

export async function action({ request }) {
  const formData = await request.formData();

  try {
    await client.mutate({
      mutation: CreatePartialDocument,
      variables: {
        cmsPartial: buildPartialInputFromFormData(formData),
      },
    });
  } catch (e) {
    return e;
  }
  await client.resetStore();

  return redirect('/cms_partials');
}

function NewCmsPartial(): JSX.Element {
  const [partial, setPartial] = useState<CmsPartialFormFields>({});
  const navigation = useNavigation();
  const createInProgress = navigation.state !== 'idle';
  const createError = useActionData();

  usePageTitle('New Partial');

  return (
    <>
      <Form action="." method="POST">
        <CmsPartialForm partial={partial} onChange={setPartial} />

        <ErrorDisplay graphQLError={createError as ApolloError} />

        <input
          type="submit"
          className="btn btn-primary"
          value="Create partial"
          disabled={createInProgress}
          aria-label="Create partial"
        />
      </Form>
    </>
  );
}

export default NewCmsPartial;
