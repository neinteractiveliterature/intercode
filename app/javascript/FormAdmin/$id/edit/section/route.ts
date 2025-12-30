import { CreateFormSectionDocument } from '~/FormAdmin/mutations.generated';
import { FormEditorQueryDocument } from '~/FormAdmin/queries.generated';
import { redirect } from 'react-router';
import { Route } from './+types/route';
import invariant from 'tiny-invariant';
import { apolloClientContext } from '../../../../AppContexts';

export const clientAction = async ({ context, request, params: { id } }: Route.ClientActionArgs) => {
  const client = context.get(apolloClientContext);
  try {
    invariant(id != null);
    if (request.method === 'POST') {
      const formData = await request.formData();

      const { data } = await client.mutate({
        mutation: CreateFormSectionDocument,
        variables: {
          formId: id,
          formSection: {
            title: formData.get('title')?.toString(),
          },
        },
        refetchQueries: [{ query: FormEditorQueryDocument, variables: { id } }],
        awaitRefetchQueries: true,
      });

      return redirect(`./${data?.createFormSection.form_section.id}`);
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
};
