import React, { useContext, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { NavLink, useHistory, useRouteMatch } from 'react-router-dom';
import { humanize, pluralize } from 'inflected';
import { useMutation } from '@apollo/react-hooks';
import Modal from 'react-bootstrap4-modal';

import { FormItemEditorContext, FormEditorContext } from './FormEditorContexts';
import CommonQuestionFields from './ItemEditors/CommonQuestionFields';
import { MoveFormItem } from './mutations.gql';
import { FormEditorQuery } from './queries.gql';
import useCollapse from '../NavigationBar/useCollapse';
import useUniqueId from '../useUniqueId';
import MultipleChoiceInput from '../BuiltInFormControls/MultipleChoiceInput';
import useModal from '../ModalDialogs/useModal';
import { parseIntOrNull } from '../ComposableFormUtils';
import useAsyncFunction from '../useAsyncFunction';
import ErrorDisplay from '../ErrorDisplay';

function StandardItemMetadata() {
  const { formType } = useContext(FormEditorContext);
  const { standardItem } = useContext(FormItemEditorContext);

  return (
    <>
      <div className="mr-2">
        <i className="fa fa-wrench" />
        {' '}
        <strong>{standardItem.description || humanize(standardItem.identifier)}</strong>
      </div>
      <div className="mr-2">
        <small>
          Standard item for
          {' '}
          {pluralize(formType.description)}
        </small>
      </div>
    </>
  );
}

function StaticTextMetadata() {
  return (
    <>
      <div>
        <i className="fa fa-paragraph" />
        {' '}
        <strong>Static text</strong>
      </div>
    </>
  );
}

function CustomItemMetadata() {
  const { formItem } = useContext(FormItemEditorContext);

  return (
    <>
      <div className="mr-2">
        <i className="fa fa-tag" />
        {' '}
        <strong>{formItem.identifier}</strong>
      </div>
      <div>
        <small>
          Custom
          {' '}
          {humanize(formItem.item_type).toLowerCase()}
          {' '}
          item
        </small>
      </div>
    </>
  );
}

function MoveFormItemModal({ visible, close }) {
  const { form, currentSection } = useContext(FormEditorContext);
  const { formItem } = useContext(FormItemEditorContext);
  const [destinationSectionId, setDestinationSectionId] = useState(null);
  const [moveFormItemMutate] = useMutation(MoveFormItem);
  const [moveFormItem, error, inProgress] = useAsyncFunction(moveFormItemMutate);
  const history = useHistory();

  const moveConfirmed = async () => {
    await moveFormItem({
      variables: {
        id: formItem.id,
        formSectionId: destinationSectionId,
      },
      refetchQueries: [
        { query: FormEditorQuery, variables: { id: form.id } },
      ],
    });
    history.replace(`/admin_forms/${form.id}/edit/section/${destinationSectionId}/item/${formItem.id}`);
    close();
  };

  return (
    <Modal visible={visible}>
      <div className="modal-header">Move form item</div>

      <div className="modal-body">
        <MultipleChoiceInput
          caption={(
            <>
              Move item
              {formItem.properties.caption ? ` “${formItem.properties.caption}” ` : ' '}
              to which section?
            </>
          )}
          choices={form.form_sections.map((formSection) => ({
            label: formSection.title,
            value: formSection.id.toString(),
            disabled: formSection.id === currentSection.id,
          }))}
          value={destinationSectionId != null ? destinationSectionId.toString() : ''}
          onChange={(value) => setDestinationSectionId(parseIntOrNull(value))}
          disabled={inProgress}
        />

        <ErrorDisplay graphQLError={error} />
      </div>

      <div className="modal-footer">
        <button
          disabled={inProgress}
          className="btn btn-secondary mr-2"
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

MoveFormItemModal.propTypes = {
  close: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
};

function FormItemTools({ saveFormItem }) {
  const match = useRouteMatch();
  const { disabled, formItem, standardItem } = useContext(FormItemEditorContext);
  const collapseRef = useRef();
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
      <div className="d-flex flex-row flex-wrap flex-lg-column mb-2">
        {renderItemMetadata()}
      </div>

      <button
        className="p-0 d-lg-none btn"
        type="button"
        onClick={toggleCollapsed}
        aria-expanded={!collapsed}
        aria-controls={collapseId}
      >
        <i className={`fa ${collapsed ? 'fa-caret-right' : 'fa-caret-down'}`} />
        {' '}
        Tools
      </button>
      <div
        id={collapseId}
        className={`${collapseClassName} d-lg-block`}
        ref={collapseRef}
        {...otherCollapseProps}
      >
        <CommonQuestionFields />
        <button className="btn btn-secondary mt-2" type="button" onClick={moveModal.open}>
          Move to another section
        </button>
      </div>

      <div className="d-flex align-items-stretch mt-2 mt-lg-4">
        <NavLink
          className="btn btn-outline-secondary col mr-2"
          to={`/admin_forms/${match.params.id}/edit/section/${match.params.sectionId}`}
          exact
          disabled={disabled}
        >
          Cancel
        </NavLink>
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

FormItemTools.propTypes = {
  saveFormItem: PropTypes.func.isRequired,
};

export default FormItemTools;
