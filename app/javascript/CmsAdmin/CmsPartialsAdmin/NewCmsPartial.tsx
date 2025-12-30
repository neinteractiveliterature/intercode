import { useState } from 'react';
import { Form, redirect, useActionData, useNavigation } from 'react-router';
import { Route } from './+types/NewCmsPartial';

import { ErrorDisplay } from '@neinteractiveliterature/litform';

import { buildPartialInputFromFormData } from './buildPartialInput';
import CmsPartialForm, { CmsPartialFormFields } from './CmsPartialForm';
import usePageTitle from '../../usePageTitle';
import { apolloClientContext } from '../../AppContexts';
import { CreatePartialDocument } from './mutations.generated';

export const clientAction = async ({ request, context }: Route.ClientActionArgs) => {
  const client = context.get(apolloClientContext);
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
};

function NewCmsPartial(): React.JSX.Element {
  const [partial, setPartial] = useState<CmsPartialFormFields>({});
  const navigation = useNavigation();
  const createInProgress = navigation.state !== 'idle';
  const createError = useActionData();

  usePageTitle('New Partial');

  return (
    <>
      <Form action="." method="POST">
        <CmsPartialForm partial={partial} onChange={setPartial} />

        <ErrorDisplay graphQLError={createError} />

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

export const Component = NewCmsPartial;
