import { useState } from 'react';
import { Form, redirect, useNavigation } from 'react-router';
import { ApolloError } from '@apollo/client';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import { buildPartialInputFromFormData } from './buildPartialInput';
import CmsPartialForm, { CmsPartialFormFields } from './CmsPartialForm';
import usePageTitle from '../../usePageTitle';
import { CreatePartialDocument } from './mutations.generated';
import { Route } from './+types/NewCmsPartial';

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();

  try {
    await context.client.mutate({
      mutation: CreatePartialDocument,
      variables: {
        cmsPartial: buildPartialInputFromFormData(formData),
      },
    });
  } catch (e) {
    return e;
  }
  await context.client.resetStore();

  return redirect('/cms_partials');
}

function NewCmsPartial({ actionData: createError }: Route.ComponentProps): JSX.Element {
  const [partial, setPartial] = useState<CmsPartialFormFields>({});
  const navigation = useNavigation();
  const createInProgress = navigation.state !== 'idle';

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
