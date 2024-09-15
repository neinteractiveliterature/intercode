import { buildOptimisticArrayForMove } from '@neinteractiveliterature/litform';
import { ActionFunction, replace } from 'react-router';
import { client } from 'useIntercodeApolloClient';
import invariant from 'tiny-invariant';
import { FormEditorQueryDocument } from 'FormAdmin/queries.generated';
import { MoveFormItemDocument } from 'FormAdmin/mutations.generated';

export const action: ActionFunction = async ({ params: { id, sectionId, itemId }, request }) => {
  try {
    const formData = await request.formData();
    const destinationSectionId = formData.get('destination_section_id')?.toString();
    invariant(id != null);
    invariant(sectionId != null);
    invariant(itemId != null);
    invariant(destinationSectionId != null);

    if (destinationSectionId === sectionId) {
      const destinationIndex = Number.parseInt(formData.get('destination_index')?.toString() ?? '');
      invariant(destinationIndex != null && !Number.isNaN(destinationIndex));

      const queryData = client.cache.readQuery({
        query: FormEditorQueryDocument,
        variables: { id: id },
      });
      const currentSection = queryData?.convention.form.form_sections.find((section) => section.id === sectionId);
      invariant(currentSection != null);

      const dragIndex = currentSection.form_items.findIndex((item) => item.id === itemId);
      invariant(dragIndex != -1);

      const optimisticItems = buildOptimisticArrayForMove(currentSection.form_items, dragIndex, destinationIndex);

      const optimisticResponse = {
        __typename: 'Mutation',
        moveFormItem: {
          __typename: 'MoveFormItemPayload',
          form_section: {
            ...currentSection,
            form_items: optimisticItems,
          },
        },
      } as const;

      const { data } = await client.mutate({
        mutation: MoveFormItemDocument,
        variables: {
          id: itemId,
          formSectionId: sectionId,
          destinationIndex,
        },
        optimisticResponse,
      });

      return data;
    } else {
      await client.mutate({
        mutation: MoveFormItemDocument,
        variables: {
          id: itemId,
          formSectionId: destinationSectionId,
        },
        refetchQueries: [{ query: FormEditorQueryDocument, variables: { id } }],
        awaitRefetchQueries: true,
      });

      return replace(`/admin_forms/${id}/edit/section/${destinationSectionId}/item/${itemId}`);
    }
  } catch (error) {
    return error;
  }
};
