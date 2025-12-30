import { useState } from 'react';
import { Form, redirect, useActionData, useNavigation } from 'react-router';
import { Route } from './+types/NewCmsLayout';

import { ErrorDisplay } from '@neinteractiveliterature/litform';

import { buildLayoutInputFromFormData } from './buildLayoutInput';
import CmsLayoutForm from './CmsLayoutForm';
import usePageTitle from '../../usePageTitle';
import { CmsLayout } from '../../graphqlTypes.generated';
import { CreateLayoutDocument } from './mutations.generated';
import { apolloClientContext } from '~/AppContexts';

export const clientAction = async ({ context, request }: Route.ClientActionArgs) => {
  const client = context.get(apolloClientContext);
  const formData = await request.formData();

  try {
    await client.mutate({
      mutation: CreateLayoutDocument,
      variables: {
        cmsLayout: buildLayoutInputFromFormData(formData),
      },
    });
  } catch (e) {
    return e;
  }
  await client.resetStore();

  return redirect('/cms_layouts');
};

function NewCmsLayout(): React.JSX.Element {
  const [layout, setLayout] = useState<Pick<CmsLayout, 'name' | 'admin_notes' | 'navbar_classes' | 'content'>>({});
  const createError = useActionData();
  const navigation = useNavigation();

  usePageTitle('New Layout');

  return (
    <Form action="." method="POST">
      <CmsLayoutForm layout={layout} onChange={setLayout} />

      <ErrorDisplay graphQLError={createError} />

      <input
        type="submit"
        className="btn btn-primary"
        value="Create layout"
        disabled={navigation.state !== 'idle'}
        aria-label="Create layout"
      />
    </Form>
  );
}

export const Component = NewCmsLayout;
