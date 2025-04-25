import { buildOptimisticArrayForMove } from '@neinteractiveliterature/litform';
import { MoveFormSectionDocument } from 'FormAdmin/mutations.generated';
import { FormEditorQueryDocument } from 'FormAdmin/queries.generated';
import { ActionFunction } from 'react-router';
import invariant from 'tiny-invariant';
import { Route } from './+types/move';
import { apolloClientContext } from 'AppContexts';

export async function action({ request, params: { id, sectionId }, context }: Route.ActionArgs) {
  try {
    const formData = await request.formData();
    const destinationIndex = Number.parseInt(formData.get('destination_index')?.toString() ?? '');
    invariant(id != null);
    invariant(sectionId != null);
    invariant(destinationIndex != null);

    const queryData = context.get(apolloClientContext).cache.readQuery({
      query: FormEditorQueryDocument,
      variables: { id: id },
    });
    let optimisticResponse;
    if (queryData != null) {
      const dragIndex = queryData.convention.form.form_sections.findIndex((section) => section.id === sectionId);
      invariant(dragIndex != -1);

      const optimisticSections = buildOptimisticArrayForMove(
        queryData.convention.form.form_sections,
        dragIndex,
        destinationIndex,
      );
      optimisticResponse = {
        __typename: 'Mutation',
        moveFormSection: {
          __typename: 'MoveFormSectionPayload',
          form: {
            ...queryData.convention.form,
            form_sections: optimisticSections,
          },
        },
      } as const;
    }

    const { data } = await context.get(apolloClientContext).mutate({
      mutation: MoveFormSectionDocument,
      variables: {
        id: sectionId,
        destinationIndex,
      },
      optimisticResponse,
    });

    return data;
  } catch (error) {
    return error;
  }
}
