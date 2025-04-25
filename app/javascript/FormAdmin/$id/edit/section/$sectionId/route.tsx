import { useContext, useRef, useMemo } from 'react';
import { redirect } from 'react-router';
import invariant from 'tiny-invariant';
import { FormSection } from 'graphqlTypes.generated';
import { DeleteFormSectionDocument, UpdateFormSectionDocument } from 'FormAdmin/mutations.generated';
import { FormEditorContext } from 'FormAdmin/FormEditorContexts';
import FormSectionNav from './FormSectionNav';
import FormSectionEditorContent from './FormSectionEditorContent';
import FormSectionEditorAddItemBar from './FormSectionEditorAddItemBar';
import styles from 'styles/form_editor.module.scss';
import { Route } from './+types/route';
import { apolloClientContext } from 'AppContexts';

export async function action({ request, params: { sectionId }, context }: Route.ActionArgs) {
  try {
    invariant(sectionId != null);
    if (request.method === 'PATCH') {
      const formData = await request.formData();
      const { data } = await context.get(apolloClientContext).mutate({
        mutation: UpdateFormSectionDocument,
        variables: { id: sectionId, formSection: { title: formData.get('title')?.toString() } },
      });

      return data;
    } else if (request.method === 'DELETE') {
      await context.get(apolloClientContext).mutate({
        mutation: DeleteFormSectionDocument,
        variables: { id: sectionId },
        update: (cache) => {
          cache.modify<FormSection>({
            id: cache.identify({ __typename: 'FormSection', id: sectionId }),
            fields: (field, { DELETE }) => DELETE,
          });
        },
      });

      return redirect('../..');
    }
  } catch (error) {
    return error;
  }
}

function FormSectionEditorLayout(): JSX.Element {
  const { currentSection, convention } = useContext(FormEditorContext);
  const sectionBottomRef = useRef<HTMLDivElement>(null);

  const formSectionQueryData = useMemo(
    () =>
      currentSection ? convention.form.form_sections.find((section) => currentSection.id === section.id) : undefined,
    [currentSection, convention.form.form_sections],
  );

  return (
    <>
      <nav className={`form-section-editor-nav ${styles.formSectionEditorNav} bg-light border-right p-2`}>
        <FormSectionNav />
      </nav>

      <div className={`form-section-editor-content ${styles.formSectionEditorContent} overflow-auto`}>
        <FormSectionEditorContent />

        <div ref={sectionBottomRef} />
      </div>

      {formSectionQueryData && <FormSectionEditorAddItemBar sectionBottomRef={sectionBottomRef} />}
    </>
  );
}

export default FormSectionEditorLayout;
