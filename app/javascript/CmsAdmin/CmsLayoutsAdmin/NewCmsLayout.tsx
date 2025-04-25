import { useState } from 'react';
import { Form, redirect, useNavigation } from 'react-router';
import { ApolloError } from '@apollo/client';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import { buildLayoutInputFromFormData } from './buildLayoutInput';
import CmsLayoutForm from './CmsLayoutForm';
import usePageTitle from '../../usePageTitle';
import { CmsLayout } from '../../graphqlTypes.generated';
import { CreateLayoutDocument } from './mutations.generated';
import { Route } from './+types/NewCmsLayout';
import { apolloClientContext } from 'AppContexts';

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();

  try {
    await context.get(apolloClientContext).mutate({
      mutation: CreateLayoutDocument,
      variables: {
        cmsLayout: buildLayoutInputFromFormData(formData),
      },
    });
  } catch (e) {
    return e;
  }
  await context.get(apolloClientContext).resetStore();

  return redirect('/cms_layouts');
}

function NewCmsLayout({ actionData: createError }: Route.ComponentProps): JSX.Element {
  const [layout, setLayout] = useState<Pick<CmsLayout, 'name' | 'admin_notes' | 'navbar_classes' | 'content'>>({});
  const navigation = useNavigation();

  usePageTitle('New Layout');

  return (
    <Form action="." method="POST">
      <CmsLayoutForm layout={layout} onChange={setLayout} />

      <ErrorDisplay graphQLError={createError as ApolloError} />

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

export default NewCmsLayout;
