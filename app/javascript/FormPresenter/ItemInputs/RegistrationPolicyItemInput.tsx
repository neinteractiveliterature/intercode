import { useMemo, useState } from 'react';
import classNames from 'classnames';
import RegistrationPolicyEditor from '../../RegistrationPolicy/RegistrationPolicyEditor';
import { withGeneratedBucketIds, withoutGeneratedBucketIds } from '../../RegistrationPolicy/RegistrationPolicy';
import { CommonFormItemInputProps } from './CommonFormItemInputProps';
import { RegistrationPolicyFormItem } from '../../FormAdmin/FormItemUtils';
import { RegistrationPolicy } from '../../graphqlTypes.generated';
import { VisibilityDisclosureCard } from './PermissionDisclosures';

export type RegistrationPolicyItemInputProps = CommonFormItemInputProps<RegistrationPolicyFormItem>;

const EMPTY_REGISTRATION_POLICY: RegistrationPolicy = {
  __typename: 'RegistrationPolicy',
  buckets: [],
  freeze_no_preference_buckets: false,
  prevent_no_preference_signups: false,
};

function RegistrationPolicyItemInput({
  formItem,
  formTypeIdentifier,
  value,
  valueInvalid,
  onChange,
  onInteract,
}: RegistrationPolicyItemInputProps): React.JSX.Element {
  const defaultValue = useMemo(() => {
    const { presets, allow_custom: allowCustom } = formItem.rendered_properties;
    if (presets && presets.length === 1 && !allowCustom) {
      return presets[0].policy;
    }
    return null;
  }, [formItem.rendered_properties]);

  const effectiveValue = !value || value.buckets.length === 0 ? defaultValue : value;

  // generatedId is the editor's own client-only bookkeeping mechanism and must never leak into
  // the form response sent to the server, so it's assigned here (once, on first load) and
  // stripped again in valueChanged before the value is handed back up.
  const [editingPolicy, setEditingPolicy] = useState(() =>
    withGeneratedBucketIds(effectiveValue ?? EMPTY_REGISTRATION_POLICY),
  );

  const valueChanged = (newValue: typeof editingPolicy) => {
    onInteract(formItem.identifier);
    setEditingPolicy(newValue);
    onChange(withoutGeneratedBucketIds(newValue));
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
          <RegistrationPolicyEditor
            registrationPolicy={editingPolicy}
            onChange={valueChanged}
            presets={formItem.rendered_properties.presets}
            allowCustom={formItem.rendered_properties.allow_custom}
            validateComplete={valueInvalid}
          />
          {valueInvalid ? <span className="text-danger">This field is required.</span> : null}
        </div>
      </VisibilityDisclosureCard>
    </fieldset>
  );
}

export default RegistrationPolicyItemInput;
