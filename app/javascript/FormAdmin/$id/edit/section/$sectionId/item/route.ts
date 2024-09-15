import { ActionFunction, json } from 'react-router';
import { FormItemInput, FormSection } from '../../../../../../graphqlTypes.generated';
import { client } from '../../../../../../useIntercodeApolloClient';
import { CreateFormItemDocument } from '../../../../../mutations.generated';
import { FormEditorFormItemFieldsFragmentDoc } from 'FormAdmin/queries.generated';

export const action: ActionFunction = async ({ request, params: { sectionId } }) => {
  try {
    if (request.method === 'POST') {
      const formItem = (await request.json()) as FormItemInput;
      const { data } = await client.mutate({
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

      return json(data);
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
};
