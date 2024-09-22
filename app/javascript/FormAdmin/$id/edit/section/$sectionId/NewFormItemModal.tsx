import { useContext, useMemo, useState } from 'react';
import { Modal } from 'react-bootstrap4-modal';
import flatMap from 'lodash/flatMap';
import classNames from 'classnames';
import { ApolloError } from '@apollo/client';
import {
  BootstrapFormCheckbox,
  BootstrapFormSelect,
  ErrorDisplay,
  HelpPopover,
  notEmpty,
  sortByLocaleString,
} from '@neinteractiveliterature/litform';

import FormItemDefaultProperties from '../../../../../../../config/form_item_default_properties.json';
import { useTranslation } from 'react-i18next';
import {
  FormTypeDefinition,
  ParsedFormItem,
  StandardItem,
  StandardItemIdentifier,
  TypedFormItem,
} from 'FormAdmin/FormItemUtils';
import { FormEditorContext } from 'FormAdmin/FormEditorContexts';
import useAsyncFunction from 'useAsyncFunction';
import buildNewFormItem from 'FormAdmin/buildNewFormItem';
import humanize from 'humanize';
import FormItemIdentifierInput from 'FormAdmin/ItemEditors/FormItemIdentifierInput';

const customItemTypes = Object.keys(FormItemDefaultProperties).filter((itemType) => itemType !== 'static_text');

const NO_CAPTION_ITEM_TYPES = ['event_email', 'registration_policy'];

const standardItemProperties = (standardItem: StandardItem | undefined, itemType: string) => {
  if (!standardItem) {
    return {};
  }

  return {
    ...(NO_CAPTION_ITEM_TYPES.includes(itemType) ? {} : { caption: standardItem.description }),
    ...(standardItem.default_properties || {}),
  };
};

export type NewFormItemModalProps<FormType extends FormTypeDefinition> = {
  visible: boolean;
  close: () => void;
  createFormItem: (item: ParsedFormItem<Record<string, unknown>, unknown>) => Promise<unknown>;
  formType: FormType;
};

function NewFormItemModal<FormType extends FormTypeDefinition>({
  visible,
  close,
  createFormItem,
  formType,
}: NewFormItemModalProps<FormType>): JSX.Element {
  const { t } = useTranslation();
  const { form } = useContext(FormEditorContext);
  const [itemType, setItemType] = useState<TypedFormItem['item_type']>();
  const [standardItem, setStandardItem] = useState<StandardItem>();
  const [identifier, setIdentifier] = useState<string>();
  const [createAsync, createError, createInProgress] = useAsyncFunction(createFormItem);

  const standardItems = formType.standard_items as Record<string, Omit<StandardItem, 'identifier'>>;

  const existingStandardItemIdentifiers = useMemo(
    () =>
      new Set(
        flatMap(
          form.form_sections.map((section) =>
            section.form_items
              .map((item) => item.identifier)
              .filter(notEmpty)
              .filter((itemIdentifier) => itemIdentifier in standardItems)
              .map((itemIdentifier) => itemIdentifier as StandardItemIdentifier<FormType>),
          ),
        ),
      ),
    [form, standardItems],
  );

  const standardItemsForDisplay = useMemo(
    () =>
      sortByLocaleString(
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

  const standardItemIdentifierOrCustomItemType = standardItem ? identifier : `_custom_${itemType}`;

  const setStandardItemIdentifierOrCustomItemType = (value: string) => {
    const match = value && value.match(/^_custom_(\w+)/);
    if (match) {
      setStandardItem(undefined);
      setItemType(match[1] as TypedFormItem['item_type']);
      setIdentifier(undefined);
    } else if (value in formType.standard_items) {
      const newStandardItem = formType.standard_items[value as keyof typeof formType.standard_items] as StandardItem;
      if (newStandardItem) {
        setStandardItem(newStandardItem);
        setItemType(newStandardItem.item_type);
        setIdentifier(value);
      } else {
        setStandardItem(undefined);
        setItemType(undefined);
        setIdentifier(undefined);
      }
    }
  };

  const addClicked = async () => {
    if (!itemType || !identifier) {
      return;
    }
    const newFormItem = buildNewFormItem(itemType);
    await createAsync({
      ...newFormItem,
      __typename: 'FormItem',
      identifier,
      default_value: (standardItem || {}).default_value,
      admin_description: (standardItem || {}).admin_description,
      public_description: (standardItem || {}).public_description,
      properties: {
        ...newFormItem.properties,
        ...standardItemProperties(standardItem, itemType),
      },
    });
    close();
  };

  const dataComplete = identifier && identifier.trim() !== '' && itemType && itemType.trim() !== '';

  return (
    <Modal visible={visible} dialogClassName="modal-xl">
      <div className="modal-header">
        <h4 className="mb-0">{t('admin.forms.addItem')}</h4>
      </div>

      <div className="modal-body">
        <div className="row mb-2">
          <div className="col-6">
            <h5>{t('admin.forms.newFormItem.standardItemsHeader', { formType: formType.description })}</h5>

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
                  disabled={existingStandardItemIdentifiers.has(item.identifier as keyof FormType['standard_items'])}
                  className={classNames({
                    'text-muted': existingStandardItemIdentifiers.has(
                      item.identifier as keyof FormType['standard_items'],
                    ),
                  })}
                />
              ))}
            </section>

            {deprecatedStandardItemsForDisplay && (
              <section className="mt-3">
                <h6>{t('admin.forms.newFormItem.deprecatedItemsHeader')}</h6>
                {deprecatedStandardItemsForDisplay.map((item) => (
                  <BootstrapFormCheckbox
                    key={item.identifier}
                    label={
                      <>
                        {item.description}{' '}
                        <HelpPopover iconSet="bootstrap-icons">{item.deprecation_reason}</HelpPopover>
                      </>
                    }
                    checked={standardItemIdentifierOrCustomItemType === item.identifier}
                    type="radio"
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setStandardItemIdentifierOrCustomItemType(item.identifier);
                      }
                    }}
                    disabled={existingStandardItemIdentifiers.has(item.identifier as keyof FormType['standard_items'])}
                    className={classNames({
                      'text-muted': existingStandardItemIdentifiers.has(
                        item.identifier as keyof FormType['standard_items'],
                      ),
                    })}
                  />
                ))}
              </section>
            )}
          </div>
          <div className="col-6">
            <h5>{t('admin.forms.newFormItem.customItemTypesHeader')}</h5>

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

        {itemType && !standardItem && (
          <FormItemIdentifierInput formType={formType} value={identifier} onChange={setIdentifier} />
        )}

        {standardItem && !standardItem.item_type && (
          <BootstrapFormSelect
            label="Item type"
            value={itemType || ''}
            onValueChange={(newValue: TypedFormItem['item_type']) => setItemType(newValue)}
          >
            <option aria-hidden value="">
              {t('admin.forms.newFormItem.itemTypeSelectPlaceholder')}
            </option>
            {customItemTypes.map((customItemType) => (
              <option key={customItemType} value={customItemType}>
                {humanize(customItemType)}
              </option>
            ))}
          </BootstrapFormSelect>
        )}

        <ErrorDisplay graphQLError={createError as ApolloError} />
      </div>

      <div className="modal-footer">
        <button className="btn btn-secondary" type="button" onClick={close} disabled={createInProgress}>
          {t('buttons.cancel')}
        </button>
        <button
          className="btn btn-primary"
          type="button"
          disabled={!dataComplete || createInProgress}
          onClick={addClicked}
        >
          {t('buttons.add')}
        </button>
      </div>
    </Modal>
  );
}

export default NewFormItemModal;
