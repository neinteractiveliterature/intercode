import { useContext, useRef, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { humanize, pluralize } from 'inflected';
import { ApolloError } from '@apollo/client';
import { Modal } from 'react-bootstrap4-modal';
import {
  useModal,
  useUniqueId,
  MultipleChoiceInput,
  parseIntOrNull,
  ErrorDisplay,
} from '@neinteractiveliterature/litform';

import { FormItemEditorContext, FormEditorContext } from './FormEditorContexts';
import CommonQuestionFields from './ItemEditors/CommonQuestionFields';
import { FormEditorQuery } from './queries';
import useCollapse from '../NavigationBar/useCollapse';
import useAsyncFunction from '../useAsyncFunction';
import { useMoveFormItemMutation } from './mutations.generated';

function StandardItemMetadata() {
  const { formType } = useContext(FormEditorContext);
  const { standardItem } = useContext(FormItemEditorContext);

  return (
    <>
      <div className="me-2">
        <i className="bi-wrench" />{' '}
        <strong>{standardItem.description || humanize(standardItem.identifier)}</strong>
      </div>
      <div className="me-2">
        <small>Standard item for {pluralize(formType.description)}</small>
      </div>
    </>
  );
}

function StaticTextMetadata() {
  return (
    <>
      <div>
        <i className="bi-paragraph" /> <strong>Static text</strong>
      </div>
    </>
  );
}

function CustomItemMetadata() {
  const { formItem } = useContext(FormItemEditorContext);

  return (
    <>
      <div className="me-2">
        <i className="bi-tag-fill" /> <strong>{formItem.identifier}</strong>
      </div>
      <div>
        <small>Custom {humanize(formItem.item_type).toLowerCase()} item</small>
      </div>
    </>
  );
}

type PropertiesWithCaption = {
  caption: string;
};

function propertiesHasCaption(properties?: object): properties is PropertiesWithCaption {
  return (
    typeof properties === 'object' &&
    Object.prototype.hasOwnProperty.call(properties, 'caption') &&
    typeof (properties as PropertiesWithCaption).caption === 'string'
  );
}

type MoveFormItemModalProps = {
  visible: boolean;
  close: () => void;
};

function MoveFormItemModal({ visible, close }: MoveFormItemModalProps) {
  const { form, currentSection } = useContext(FormEditorContext);
  const { formItem } = useContext(FormItemEditorContext);
  const [destinationSectionId, setDestinationSectionId] = useState<number>();
  const [moveFormItemMutate] = useMoveFormItemMutation();
  const [moveFormItem, error, inProgress] = useAsyncFunction(moveFormItemMutate);
  const history = useHistory();

  const moveConfirmed = async () => {
    if (destinationSectionId == null) {
      return;
    }

    await moveFormItem({
      variables: {
        id: formItem.id,
        formSectionId: destinationSectionId,
      },
      refetchQueries: [{ query: FormEditorQuery, variables: { id: form.id } }],
    });
    history.replace(
      `/admin_forms/${form.id}/edit/section/${destinationSectionId}/item/${formItem.id}`,
    );
    close();
  };

  const caption = propertiesHasCaption(formItem.properties)
    ? formItem.properties.caption
    : undefined;

  return (
    <Modal visible={visible}>
      <div className="modal-header">Move form item</div>

      <div className="modal-body">
        <MultipleChoiceInput
          caption={
            <>
              Move item
              {caption ? ` “${caption}” ` : ' '}
              to which section?
            </>
          }
          choices={form.form_sections.map((formSection) => ({
            label: formSection.title,
            value: formSection.id.toString(),
            disabled: formSection.id === currentSection!.id,
          }))}
          value={destinationSectionId != null ? destinationSectionId.toString() : ''}
          onChange={(value: string) => setDestinationSectionId(parseIntOrNull(value) ?? undefined)}
          disabled={inProgress}
        />

        <ErrorDisplay graphQLError={error as ApolloError} />
      </div>

      <div className="modal-footer">
        <button
          disabled={inProgress}
          className="btn btn-secondary me-2"
          type="button"
          onClick={close}
        >
          Cancel
        </button>

        <button
          disabled={inProgress || !destinationSectionId}
          className="btn btn-primary"
          type="button"
          onClick={moveConfirmed}
        >
          Move item
        </button>
      </div>
    </Modal>
  );
}

export type FormItemToolsProps = {
  saveFormItem: () => Promise<any>;
};

function FormItemTools({ saveFormItem }: FormItemToolsProps) {
  const match = useRouteMatch<{ id: string; sectionId: string }>();
  const history = useHistory();
  const { disabled, formItem, setFormItem, standardItem } = useContext(FormItemEditorContext);
  const collapseRef = useRef<HTMLDivElement>(null);
  const { collapsed, collapseProps, toggleCollapsed } = useCollapse(collapseRef);
  const { className: collapseClassName, ...otherCollapseProps } = collapseProps;
  const collapseId = useUniqueId('collapse-');
  const moveModal = useModal();

  const renderItemMetadata = () => {
    if (standardItem) {
      return <StandardItemMetadata />;
    }

    if (formItem.item_type === 'static_text') {
      return <StaticTextMetadata />;
    }

    return <CustomItemMetadata />;
  };

  return (
    <>
      <div className="d-flex flex-row flex-wrap flex-lg-column mb-2">{renderItemMetadata()}</div>

      <button
        className="p-0 d-lg-none btn"
        type="button"
        onClick={toggleCollapsed}
        aria-expanded={!collapsed}
        aria-controls={collapseId}
      >
        <i className={collapsed ? 'bi-caret-right' : 'bi-caret-down'} /> Tools
      </button>
      <div
        id={collapseId}
        className={`${collapseClassName} d-lg-block`}
        ref={collapseRef}
        {...otherCollapseProps}
      >
        <CommonQuestionFields formItem={formItem} setFormItem={setFormItem} />
        <button className="btn btn-secondary mt-2" type="button" onClick={moveModal.open}>
          Move to another section
        </button>
      </div>

      <div className="d-flex align-items-stretch mt-2 mt-lg-4">
        <button
          className="btn btn-outline-secondary col me-2"
          disabled={disabled}
          type="button"
          onClick={() => {
            history.push(`/admin_forms/${match.params.id}/edit/section/${match.params.sectionId}`);
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-primary col"
          onClick={saveFormItem}
          disabled={disabled}
        >
          Save
        </button>
      </div>

      <MoveFormItemModal visible={moveModal.visible} close={moveModal.close} />
    </>
  );
}

export default FormItemTools;
