import { useCallback, useMemo } from 'react';
import classNames from 'classnames';
import { TFunction } from 'i18next';
import { BootstrapFormInput, useUniqueId, parseIntOrNull } from '@neinteractiveliterature/litform';

import { useTranslation, Trans } from 'react-i18next';
import { EditorView } from '@codemirror/view';
import FieldRequiredFeedback from './FieldRequiredFeedback';
import MarkdownInput from '../../BuiltInFormControls/MarkdownInput';
import RequiredIndicator from './RequiredIndicator';
import { CommonFormItemInputProps } from './CommonFormItemInputProps';
import { AgeRestrictionsFormItem } from '../../FormAdmin/FormItemUtils';
import { FORM_ITEM_ROLE_COLOR_CLASSES, VisibilityDisclosureText } from './PermissionDisclosures';

function getDefaultAgeRestrictionsDescription(minimumAge: number | null | undefined, t: TFunction) {
  if (!minimumAge) {
    return t('forms.ageRestrictions.noRestrictions', 'No age restrictions.');
  }

  return t('forms.ageRestrictions.minimumAgeDescription', 'Must be {{ count }} years or older.', {
    count: minimumAge,
  });
}

export type AgeRestrictionsInputProps = CommonFormItemInputProps<AgeRestrictionsFormItem>;

function AgeRestrictionsInput(props: AgeRestrictionsInputProps): JSX.Element {
  const { t } = useTranslation();
  const { formItem, onChange, onInteract, valueInvalid, formTypeIdentifier, formResponseReference } = props;
  const value = useMemo(() => props.value ?? {}, [props.value]);

  const descriptionId = useUniqueId(`${formItem.identifier}-description-`);

  const userInteracted = useCallback(() => onInteract(formItem.identifier), [onInteract, formItem.identifier]);

  const extensions = useMemo(
    () => [
      EditorView.domEventHandlers({
        blur: userInteracted,
      }),
    ],
    [userInteracted],
  );

  const descriptionChanged = useCallback(
    (newDescription) => {
      onChange({ ...value, age_restrictions_description: newDescription });
      userInteracted();
    },
    [onChange, userInteracted, value],
  );

  const minimumAgeChanged = useCallback(
    (newMinimumAgeString) => {
      const newMinimumAge = parseIntOrNull(newMinimumAgeString);

      if (
        !value.age_restrictions_description ||
        value.age_restrictions_description.trim() === '' ||
        value.age_restrictions_description === getDefaultAgeRestrictionsDescription(value.minimum_age, t)
      ) {
        onChange({
          ...value,
          age_restrictions_description: getDefaultAgeRestrictionsDescription(newMinimumAge, t),
          minimum_age: newMinimumAge,
        });
      } else {
        onChange({ ...value, minimum_age: newMinimumAge });
      }

      userInteracted();
    },
    [onChange, userInteracted, value, t],
  );

  return (
    <div className={classNames('card my-2', FORM_ITEM_ROLE_COLOR_CLASSES[formItem.visibility])}>
      <div className="card-header py-0">
        <legend
          className="col-form-label"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: formItem.rendered_properties.caption }}
        />
      </div>

      <div className="card-body pb-1">
        <div className="mb-3">
          <label className="form-label" htmlFor={descriptionId}>
            {t('forms.ageRestrictions.descriptionLabel', 'Publicly visible age restrictions text')}
            <RequiredIndicator formItem={formItem} />
          </label>
          <MarkdownInput
            value={value.age_restrictions_description || ''}
            onChange={descriptionChanged}
            extensions={extensions}
            lines={1}
            formControlClassName={classNames({ 'is-invalid': valueInvalid })}
            eventId={formResponseReference?.type === 'Event' ? formResponseReference.id : undefined}
            eventProposalId={formResponseReference?.type === 'EventProposal' ? formResponseReference.id : undefined}
          >
            <FieldRequiredFeedback valueInvalid={valueInvalid} />
          </MarkdownInput>
        </div>

        <BootstrapFormInput
          value={value.minimum_age ? value.minimum_age.toString() : ''}
          onTextChange={minimumAgeChanged}
          type="number"
          min="0"
          label={t('forms.ageRestrictions.minimumAgeLabel', 'Minimum age')}
          helpText={
            <Trans i18nKey="forms.ageRestrictions.minimumAgeHelpText">
              If specified, the signups list will warn you if someone too young to play has signed up.{' '}
              <strong>The site does not enforce age restrictions; you must do so yourself.</strong>
            </Trans>
          }
        />
      </div>

      <div className="card-footer">
        <VisibilityDisclosureText formItem={formItem} formTypeIdentifier={formTypeIdentifier} />
      </div>
    </div>
  );
}

export default AgeRestrictionsInput;
