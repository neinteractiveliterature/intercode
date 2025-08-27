import { useState, useCallback } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { BootstrapFormInput, ChoiceSet, FormGroupWithLabel } from '@neinteractiveliterature/litform';

import RequiredIndicator from './RequiredIndicator';
import EmailAliasInput from '../../BuiltInFormControls/EmailAliasInput';
import { CommonFormItemInputProps } from './CommonFormItemInputProps';
import { ConventionForFormItemDisplay } from '../ItemDisplays/FormItemDisplay';
import { EventEmailFormItem, EventEmailValue } from '../../FormAdmin/FormItemUtils';
import { VisibilityDisclosureCard } from './PermissionDisclosures';

export type EventEmailInputProps = CommonFormItemInputProps<EventEmailFormItem> & {
  convention: ConventionForFormItemDisplay;
};

type EventEmailBehavior = NonNullable<'team_mailing_list' | EventEmailValue['con_mail_destination']>;

function EventEmailInput({
  convention,
  value: uncheckedValue,
  formItem,
  formTypeIdentifier,
  onChange,
  onInteract,
  valueInvalid,
}: EventEmailInputProps): React.JSX.Element {
  const { t } = useTranslation();
  const value = uncheckedValue ?? {};
  const [emailBehavior, setEmailBehavior] = useState<EventEmailBehavior | undefined>(() => {
    const teamMailingListName = value.team_mailing_list_name;
    return teamMailingListName && convention.event_mailing_list_domain
      ? 'team_mailing_list'
      : value.con_mail_destination;
  });
  const userDidInteract = useCallback(() => onInteract(formItem.identifier), [formItem.identifier, onInteract]);

  const updateValue = useCallback(
    (newValue: EventEmailValue) => {
      userDidInteract();
      if (emailBehavior === 'team_mailing_list') {
        onChange({
          // always send something Ruby will consider truthy if the email behavior is to use
          // a team mailing list
          team_mailing_list_name: '',
          ...newValue,
          email:
            newValue.team_mailing_list_name && newValue.team_mailing_list_name.trim() !== ''
              ? `${newValue.team_mailing_list_name}@${convention.event_mailing_list_domain}`
              : undefined,
        });
      } else {
        onChange({
          ...newValue,
          team_mailing_list_name: undefined,
        });
      }
    },
    [emailBehavior, convention.event_mailing_list_domain, userDidInteract, onChange],
  );

  const emailBehaviorChanged = (newBehavior: EventEmailBehavior) => {
    setEmailBehavior(newBehavior);
    if (newBehavior === 'team_mailing_list') {
      onChange({
        // always send something Ruby will consider truthy if the email behavior is to use
        // a team mailing list
        team_mailing_list_name: '',
        ...(value || {}),
        con_mail_destination: 'event_email',
      });
    } else {
      onChange({
        ...(value || {}),
        con_mail_destination: newBehavior,
        team_mailing_list_name: undefined,
      });
    }
    userDidInteract();
  };

  const renderEmailInput = () => {
    if (emailBehavior === 'team_mailing_list') {
      return (
        <FormGroupWithLabel
          label={
            <>
              {t('forms.eventEmail.mailingListAddressLabel')}
              <RequiredIndicator formItem={formItem} />
            </>
          }
        >
          {(id) => (
            <EmailAliasInput
              value={(value || {}).team_mailing_list_name}
              onTextChange={(newName) => updateValue({ ...value, team_mailing_list_name: newName })}
              id={id}
              aria-label={t('forms.eventEmail.mailingListAliasLabel')}
              domain={convention.event_mailing_list_domain ?? ''}
            />
          )}
        </FormGroupWithLabel>
      );
    }

    return (
      <BootstrapFormInput
        label={
          <>
            {t('forms.eventEmail.contactEmailLabel')}
            <RequiredIndicator formItem={formItem} />
          </>
        }
        name={`${formItem.identifier}.email`}
        value={(value || {}).email || ''}
        onTextChange={(newEmail) => updateValue({ ...value, email: newEmail })}
        disabled={emailBehavior == null}
      />
    );
  };

  return (
    <fieldset className="mb-3">
      <VisibilityDisclosureCard formItem={formItem} formTypeIdentifier={formTypeIdentifier}>
        <div
          className={classNames({
            'border-0': !valueInvalid,
            'border rounded border-danger': valueInvalid,
          })}
        >
          <legend className="col-form-label">
            <span>{t('forms.eventEmail.formGroupLegend')}</span>
            <RequiredIndicator formItem={formItem} />
          </legend>
          <ChoiceSet
            name={formItem.identifier}
            choices={[
              ...(convention.event_mailing_list_domain
                ? [
                    {
                      label: t('forms.eventEmail.teamMailingListOption'),
                      value: 'team_mailing_list',
                    },
                  ]
                : []),
              {
                label: t('forms.eventEmail.eventEmailOption'),
                value: 'event_email',
              },
              {
                label: t('forms.eventEmail.teamMembersOption'),
                value: 'gms',
              },
            ]}
            value={emailBehavior}
            onChange={emailBehaviorChanged}
          />
          <div className="mt-4">{renderEmailInput()}</div>
          {valueInvalid ? <span className="text-danger">{t('forms.general.fieldRequiredError')}</span> : null}
        </div>
      </VisibilityDisclosureCard>
    </fieldset>
  );
}

export default EventEmailInput;
