import { useContext } from 'react';
import { BootstrapFormInput, BooleanInput, useModal, MultipleChoiceInput } from '@neinteractiveliterature/litform';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

import {
  formItemPropertyUpdater,
  TypedFormItem,
  WithRequiredProperties,
  CommonQuestionProperties,
  ParsedFormItem,
} from '../FormItemUtils';
import DefaultAnswerModal from './DefaultAnswerModal';
import { FormEditorContext, FormEditorContextValue, FormItemEditorContext } from '../FormEditorContexts';
import FormItemIdentifierInput from './FormItemIdentifierInput';
import { FormItemEditorProps } from '../FormItemEditorProps';
import { FormItemExposeIn, FormItemRole } from '../../graphqlTypes.generated';
import { describeFormItemRole } from '../../FormPresenter/ItemInputs/PermissionDisclosures';

export type CommonQuestionFieldsProps = FormItemEditorProps<TypedFormItem>;

type CommonQuestionFieldsFormItem = CommonQuestionFieldsProps['formItem'];
type QuestionFormItem = WithRequiredProperties<
  ParsedFormItem<
    CommonQuestionProperties,
    CommonQuestionFieldsFormItem['default_value'],
    CommonQuestionFieldsFormItem['item_type']
  >
>;

function applicableRoles(
  purpose: 'visibility' | 'writeability',
  formTypeIdentifier: FormEditorContextValue['formTypeIdentifier'],
): FormItemRole[] {
  return [
    FormItemRole.Normal,
    ...(formTypeIdentifier === 'event' && purpose === 'visibility'
      ? [FormItemRole.ConfirmedAttendee, FormItemRole.TeamMember]
      : []),
    ...(formTypeIdentifier === 'user_con_profile' ? [FormItemRole.AllProfilesBasicAccess] : []),
    FormItemRole.Admin,
  ];
}

function getRoleOptionsForFormTypeIdentifier(
  purpose: 'visibility' | 'writeability',
  formTypeIdentifier: FormEditorContextValue['formTypeIdentifier'],
  t: TFunction,
) {
  return applicableRoles(purpose, formTypeIdentifier).map((role) => ({
    label: describeFormItemRole(purpose, role, formTypeIdentifier, t),
    value: role,
  }));
}

function formItemIsQuestion(formItem: CommonQuestionFieldsFormItem): formItem is QuestionFormItem {
  return formItem.item_type !== 'static_text';
}

function CommonQuestionFields({ formItem, setFormItem }: CommonQuestionFieldsProps): React.JSX.Element {
  const { formType, formTypeIdentifier } = useContext(FormEditorContext);
  const { standardItem } = useContext(FormItemEditorContext);
  const defaultAnswerModal = useModal();
  const { t } = useTranslation();

  return (
    <div>
      <DefaultAnswerModal
        formItem={formItem}
        setFormItem={setFormItem}
        close={defaultAnswerModal.close}
        visible={defaultAnswerModal.visible}
      />
      {formItemIsQuestion(formItem) && !standardItem && (
        <FormItemIdentifierInput
          value={formItem.identifier ?? undefined}
          onChange={(identifier) => setFormItem((prevFormItem) => ({ ...prevFormItem, identifier }))}
          formType={formType}
        />
      )}
      {formItemIsQuestion(formItem) &&
        (standardItem && standardItem.required ? (
          <div className="small mb-2">Response always required</div>
        ) : (
          <BooleanInput
            caption="Response required?"
            value={!!formItem.properties.required}
            onChange={formItemPropertyUpdater<CommonQuestionProperties, QuestionFormItem, 'required'>(
              'required',
              setFormItem,
            )}
          />
        ))}
      <BootstrapFormInput
        label="Admin description"
        helpText="The name for this item in admin-facing reports.  If blank, the caption of the item will be used."
        value={formItem.admin_description ?? ''}
        onTextChange={(value) =>
          setFormItem((prevFormItem) => ({
            ...prevFormItem,
            admin_description: value,
          }))
        }
      />
      <BootstrapFormInput
        label="Public description"
        helpText="The name for this item in public-facing views.  If blank, the item will not appear in public-facing views."
        value={formItem.public_description ?? ''}
        onTextChange={(value) =>
          setFormItem((prevFormItem) => ({
            ...prevFormItem,
            public_description: value,
          }))
        }
      />
      <MultipleChoiceInput
        caption="Visibility"
        value={formItem.visibility}
        onChange={(value) => {
          if (value) {
            setFormItem((prevFormItem) => ({ ...prevFormItem, visibility: value as FormItemRole }));
          }
        }}
        choices={getRoleOptionsForFormTypeIdentifier('visibility', formTypeIdentifier, t)}
      />
      <MultipleChoiceInput
        caption="Writeability"
        value={formItem.writeability}
        onChange={(value) => {
          if (value) {
            setFormItem((prevFormItem) => ({
              ...prevFormItem,
              writeability: value as FormItemRole,
            }));
          }
        }}
        choices={getRoleOptionsForFormTypeIdentifier('writeability', formTypeIdentifier, t)}
      />
      {formTypeIdentifier === 'event' && (
        <MultipleChoiceInput
          caption="Expose in"
          value={formItem.expose_in}
          multiple
          onChange={(value) =>
            setFormItem((prevFormItem) => ({ ...prevFormItem, expose_in: value as FormItemExposeIn[] }))
          }
          choices={[
            { label: 'Event catalog', value: 'event_catalog' },
            { label: 'Schedule popup', value: 'schedule_popup' },
          ]}
        />
      )}
      <button type="button" className="btn btn-secondary" onClick={defaultAnswerModal.open}>
        {formItem.default_value ? 'Edit default answer' : 'Add default answer'}
      </button>
    </div>
  );
}

export default CommonQuestionFields;
