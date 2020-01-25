import React, { useContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap4-modal';
import flatMap from 'lodash-es/flatMap';
import { humanize } from 'inflected';
import classNames from 'classnames';

import { FormEditorContext } from './FormEditorContexts';
import { sortByLocaleString } from '../ValueUtils';
import FormItemDefaultProperties from '../../../config/form_item_default_properties.json';
import buildNewFormItem from './buildNewFormItem';
import BootstrapFormSelect from '../BuiltInFormControls/BootstrapFormSelect';
import BootstrapFormCheckbox from '../BuiltInFormControls/BootstrapFormCheckbox';
import FormItemIdentifierInput from './ItemEditors/FormItemIdentifierInput';
import HelpPopover from '../UIComponents/HelpPopover';
import useAsyncFunction from '../useAsyncFunction';
import ErrorDisplay from '../ErrorDisplay';

const customItemTypes = Object.keys(FormItemDefaultProperties).filter(
  (itemType) => itemType !== 'static_text',
);

const standardItemProperties = (standardItem) => {
  if (!standardItem) {
    return {};
  }

  return {
    caption: standardItem.description,
    ...(standardItem.default_properties || {}),
  };
};

function NewFormItemModal({ visible, close, createFormItem }) {
  const { form, formType } = useContext(FormEditorContext);
  const [itemType, setItemType] = useState(null);
  const [standardItem, setStandardItem] = useState(null);
  const [identifier, setIdentifier] = useState(null);
  const [createAsync, createError, createInProgress] = useAsyncFunction(createFormItem);

  const standardItems = formType.standard_items;

  const existingStandardItemIdentifiers = useMemo(
    () => new Set(flatMap(form.form_sections.map((section) => (
      section.form_items.filter((item) => standardItems[item.identifier])
        .map((item) => item.identifier)
    )))),
    [form, standardItems],
  );

  const standardItemsForDisplay = useMemo(
    () => sortByLocaleString(
      Object.entries(standardItems).map(([itemIdentifier, item]) => ({
        ...item,
        identifier: itemIdentifier,
      })),
      (item) => item.description,
    ),
    [standardItems],
  );

  const nonDeprecatedStandardItemsForDisplay = useMemo(
    () => standardItemsForDisplay.filter((item) => !item.deprecation_reason),
    [standardItemsForDisplay],
  );

  const deprecatedStandardItemsForDisplay = useMemo(
    () => standardItemsForDisplay.filter((item) => item.deprecation_reason),
    [standardItemsForDisplay],
  );

  const standardItemIdentifierOrCustomItemType = (
    standardItem ? identifier : `_custom_${itemType}`
  );

  const setStandardItemIdentifierOrCustomItemType = (value) => {
    const match = (value && value.match(/^_custom_(\w+)/));
    if (match) {
      setStandardItem(null);
      setItemType(match[1]);
      setIdentifier(null);
    } else {
      const newStandardItem = formType.standard_items[value];
      if (newStandardItem) {
        setStandardItem(newStandardItem);
        setItemType(newStandardItem.item_type);
        setIdentifier(value);
      } else {
        setStandardItem(null);
        setItemType(null);
        setIdentifier(null);
      }
    }
  };

  const addClicked = async () => {
    const newFormItem = buildNewFormItem(itemType);
    await createAsync({
      ...newFormItem,
      identifier,
      default_value: (standardItem || {}).default_value,
      admin_description: (standardItem || {}).admin_description,
      public_description: (standardItem || {}).public_description,
      properties: {
        ...newFormItem.properties,
        ...standardItemProperties(standardItem),
      },
    });
    close();
  };

  const dataComplete = (
    identifier && identifier.trim() !== ''
    && itemType && itemType.trim() !== ''
  );

  return (
    <Modal visible={visible} dialogClassName="modal-xl">
      <div className="modal-header">
        <h4 className="mb-0">
          Add item
        </h4>
      </div>

      <div className="modal-body">
        <div className="row mb-2">
          <div className="col-6">
            <h5>
              Standard
              {' '}
              {formType.description}
              {' '}
              items
            </h5>

            <section>
              {nonDeprecatedStandardItemsForDisplay.map((item) => (
                <BootstrapFormCheckbox
                  key={item.identifier}
                  label={item.description}
                  checked={standardItemIdentifierOrCustomItemType === item.identifier}
                  type="radio"
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setStandardItemIdentifierOrCustomItemType(item.identifier);
                    }
                  }}
                  disabled={existingStandardItemIdentifiers.has(item.identifier)}
                  className={classNames({ 'text-muted': existingStandardItemIdentifiers.has(item.identifier) })}
                />
              ))}
            </section>

            {deprecatedStandardItemsForDisplay && (
              <section className="mt-3">
                <h6>Deprecated items</h6>
                {deprecatedStandardItemsForDisplay.map((item) => (
                  <BootstrapFormCheckbox
                    key={item.identifier}
                    label={(
                      <>
                        {item.description}
                        {' '}
                        <HelpPopover>
                          {item.deprecation_reason}
                        </HelpPopover>
                      </>
                    )}
                    checked={standardItemIdentifierOrCustomItemType === item.identifier}
                    type="radio"
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setStandardItemIdentifierOrCustomItemType(item.identifier);
                      }
                    }}
                    disabled={existingStandardItemIdentifiers.has(item.identifier)}
                    className={classNames({ 'text-muted': existingStandardItemIdentifiers.has(item.identifier) })}
                  />
                ))}
              </section>
            )}
          </div>
          <div className="col-6">
            <h5>Custom item types</h5>

            {customItemTypes.map((customItemType) => (
              <BootstrapFormCheckbox
                key={customItemType}
                label={humanize(customItemType)}
                checked={standardItemIdentifierOrCustomItemType === `_custom_${customItemType}`}
                type="radio"
                onCheckedChange={(checked) => {
                  if (checked) {
                    setStandardItemIdentifierOrCustomItemType(`_custom_${customItemType}`);
                  }
                }}
              />
            ))}
          </div>
        </div>

        {(itemType && !standardItem) && (
          <FormItemIdentifierInput
            formType={formType}
            value={identifier}
            onChange={setIdentifier}
          />
        )}

        {(standardItem && !standardItem.item_type) && (
          <BootstrapFormSelect
            label="Item type"
            value={itemType || ''}
            onValueChange={setItemType}
          >
            <option aria-hidden value="">Choose an item type...</option>
            {customItemTypes.map((customItemType) => (
              <option key={customItemType} value={customItemType}>
                {humanize(customItemType)}
              </option>
            ))}
          </BootstrapFormSelect>
        )}

        <ErrorDisplay graphQLError={createError} />
      </div>

      <div className="modal-footer">
        <button
          className="btn btn-secondary"
          type="button"
          onClick={close}
          disabled={createInProgress}
        >
          Cancel
        </button>
        <button
          className="btn btn-primary"
          type="button"
          disabled={!dataComplete || createInProgress}
          onClick={addClicked}
        >
          Add
        </button>
      </div>
    </Modal>
  );
}

NewFormItemModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  createFormItem: PropTypes.func.isRequired,
};

export default NewFormItemModal;
