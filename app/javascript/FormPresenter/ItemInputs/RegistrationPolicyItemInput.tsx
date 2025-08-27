import { useMemo } from 'react';
import classNames from 'classnames';
import RegistrationPolicyEditor from '../../RegistrationPolicy/RegistrationPolicyEditor';
import { CommonFormItemInputProps } from './CommonFormItemInputProps';
import { RegistrationPolicyFormItem } from '../../FormAdmin/FormItemUtils';
import { RegistrationPolicy } from '../../graphqlTypes.generated';
import { VisibilityDisclosureCard } from './PermissionDisclosures';

export type RegistrationPolicyItemInputProps = CommonFormItemInputProps<RegistrationPolicyFormItem>;

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

  const valueChanged = (newValue: RegistrationPolicy) => {
    onInteract(formItem.identifier);
    onChange(newValue);
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
            registrationPolicy={effectiveValue ?? undefined}
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
