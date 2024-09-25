import { CreateFormSectionDocument } from 'FormAdmin/mutations.generated';
import { FormEditorQueryDocument } from 'FormAdmin/queries.generated';
import { redirect } from 'react-router';
import invariant from 'tiny-invariant';
import { Route } from './+types/route';

export async function action({ request, params: { id }, context }: Route.ActionArgs) {
  try {
    invariant(id != null);
    if (request.method === 'POST') {
      const formData = await request.formData();

      const { data } = await context.client.mutate({
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
}
