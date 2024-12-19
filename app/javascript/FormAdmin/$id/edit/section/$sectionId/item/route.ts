import { data } from 'react-router';
import { FormItemInput, FormSection } from '../../../../../../graphqlTypes.generated';
import { CreateFormItemDocument } from '../../../../../mutations.generated';
import { FormEditorFormItemFieldsFragmentDoc } from 'FormAdmin/queries.generated';
import { Route } from './+types/route';

export async function action({ request, params: { sectionId }, context }: Route.ActionArgs) {
  try {
    if (request.method === 'POST') {
      const formItem = (await request.json()) as FormItemInput;
      const result = await context.client.mutate({
        mutation: CreateFormItemDocument,
        variables: {
          formSectionId: sectionId,
          formItem,
        },
        update: (cache, result) => {
          const formItem = result.data?.createFormItem.form_item;
          if (formItem) {
            const itemRef = cache.writeFragment({
              data: formItem,
              fragment: FormEditorFormItemFieldsFragmentDoc,
              fragmentName: 'FormEditorFormItemFields',
            });
            cache.modify<FormSection>({
              id: cache.identify({ __typename: 'FormSection', id: sectionId }),
              fields: {
                form_items: (value) => [...value, itemRef],
              },
            });
          }
        },
      });

      return data(result.data);
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
}
