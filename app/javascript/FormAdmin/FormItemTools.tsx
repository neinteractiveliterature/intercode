import { useContext, useId, useRef, useState } from 'react';
import { useFetcher, useNavigate, useParams } from 'react-router-dom';
import { ApolloError } from '@apollo/client';
import { Modal } from 'react-bootstrap4-modal';
import { useModal, MultipleChoiceInput, ErrorDisplay } from '@neinteractiveliterature/litform';

import { FormItemEditorContext, FormEditorContext } from './FormEditorContexts';
import CommonQuestionFields from './ItemEditors/CommonQuestionFields';
import useCollapse from '../NavigationBar/useCollapse';
import humanize from '../humanize';

function StandardItemMetadata() {
  const { formType } = useContext(FormEditorContext);
  const { standardItem } = useContext(FormItemEditorContext);

  if (!standardItem) {
    return <></>;
  }

  return (
    <>
      <div className="me-2">
        <i className="bi-wrench" /> <strong>{standardItem.description || humanize(standardItem.identifier)}</strong>
      </div>
      <div className="me-2">
        <small>Standard item for {formType.description} forms</small>
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

function propertiesHasCaption(properties?: Record<string, unknown>): properties is PropertiesWithCaption {
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
  const [destinationSectionId, setDestinationSectionId] = useState<string>();
  const fetcher = useFetcher();
  const error = fetcher.data instanceof Error ? fetcher.data : undefined;
  const inProgress = fetcher.state !== 'idle';

  const moveConfirmed = async () => {
    if (destinationSectionId == null) {
      return;
    }

    fetcher.submit({ destination_section_id: destinationSectionId }, { action: './move', method: 'PATCH' });
  };

  const caption = propertiesHasCaption(formItem.properties) ? formItem.properties.caption : undefined;

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
            disabled: currentSection && formSection.id === currentSection.id,
          }))}
          value={destinationSectionId != null ? destinationSectionId.toString() : ''}
          onChange={(value: string) => setDestinationSectionId(value)}
          disabled={inProgress}
        />

        <ErrorDisplay graphQLError={error as ApolloError} />
      </div>

      <div className="modal-footer">
        <button disabled={inProgress} className="btn btn-secondary me-2" type="button" onClick={close}>
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
  saveFormItem: () => Promise<unknown>;
};

function FormItemTools({ saveFormItem }: FormItemToolsProps): JSX.Element {
  const params = useParams<{ id: string; sectionId: string }>();
  const navigate = useNavigate();
  const { disabled, formItem, setFormItem, standardItem } = useContext(FormItemEditorContext);
  const collapseRef = useRef<HTMLDivElement>(null);
  const { collapsed, collapseProps, toggleCollapsed } = useCollapse(collapseRef);
  const { className: collapseClassName, ...otherCollapseProps } = collapseProps;
  const collapseId = useId();
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
      <div id={collapseId} className={`${collapseClassName} d-lg-block`} ref={collapseRef} {...otherCollapseProps}>
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
            navigate(`/admin_forms/${params.id}/edit/section/${params.sectionId}`);
          }}
        >
          Cancel
        </button>
        <button type="button" className="btn btn-primary col" onClick={saveFormItem} disabled={disabled}>
          Save
        </button>
      </div>

      <MoveFormItemModal visible={moveModal.visible} close={moveModal.close} />
    </>
  );
}

export default FormItemTools;
