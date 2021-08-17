import { useContext } from 'react';
import {
  BootstrapFormInput,
  BooleanInput,
  useModal,
  MultipleChoiceInput,
} from '@neinteractiveliterature/litform';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { assertNever } from 'assert-never';

import {
  formItemPropertyUpdater,
  TypedFormItem,
  WithRequiredProperties,
  CommonQuestionProperties,
  ParsedFormItem,
} from '../FormItemUtils';
import DefaultAnswerModal from './DefaultAnswerModal';
import {
  FormEditorContext,
  FormEditorContextValue,
  FormItemEditorContext,
} from '../FormEditorContexts';
import FormItemIdentifierInput from './FormItemIdentifierInput';
import { FormItemEditorProps } from '../FormItemEditorProps';
import { FormItemRole } from '../../graphqlTypes.generated';

export type CommonQuestionFieldsProps = FormItemEditorProps<TypedFormItem>;

type CommonQuestionFieldsFormItem = CommonQuestionFieldsProps['formItem'];
type QuestionFormItem = WithRequiredProperties<
  ParsedFormItem<CommonQuestionProperties, any, CommonQuestionFieldsFormItem['item_type']>
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
    FormItemRole.Admin,
  ];
}

function describeRole(
  purpose: 'visibility' | 'writeability',
  role: FormItemRole,
  formTypeIdentifier: FormEditorContextValue['formTypeIdentifier'],
  t: TFunction,
): string {
  switch (role) {
    case FormItemRole.Admin:
      return t('forms.roles.admin', 'Admin only');
    case FormItemRole.ConfirmedAttendee:
      return t('forms.roles.confirmed_attendee', 'Confirmed attendees, team members, and admins');
    case FormItemRole.TeamMember:
      return t('forms.roles.team_member', 'Team members and admins');
    case FormItemRole.Normal:
      switch (formTypeIdentifier) {
        case 'event':
          if (purpose === 'visibility') {
            return t('forms.roles.public', 'Public');
          }
          return t('forms.roles.team_member', 'Team members and admins');
        case 'event_proposal':
          return t('forms.roles.proposer', 'Event proposer, reviewers, and admins');
        case 'user_con_profile':
          return t('forms.roles.user', 'User and admins');
        default:
          assertNever(formTypeIdentifier);
      }
      break;
    default:
      assertNever(role);
  }

  return "If you're seeing this message something has gone very wrong";
}

function getRoleOptionsForFormTypeIdentifier(
  purpose: 'visibility' | 'writeability',
  formTypeIdentifier: FormEditorContextValue['formTypeIdentifier'],
  t: TFunction,
) {
  return applicableRoles(purpose, formTypeIdentifier).map((role) => ({
    label: describeRole(purpose, role, formTypeIdentifier, t),
    value: role,
  }));
}

function formItemIsQuestion(formItem: CommonQuestionFieldsFormItem): formItem is QuestionFormItem {
  return formItem.item_type !== 'static_text';
}

function CommonQuestionFields({ formItem, setFormItem }: CommonQuestionFieldsProps) {
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
          onChange={(identifier) =>
            setFormItem((prevFormItem) => ({ ...prevFormItem, identifier }))
          }
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
            onChange={formItemPropertyUpdater<QuestionFormItem, 'required'>(
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
      <button type="button" className="btn btn-secondary" onClick={defaultAnswerModal.open}>
        {formItem.default_value ? 'Edit default answer' : 'Add default answer'}
      </button>
    </div>
  );
}

export default CommonQuestionFields;
