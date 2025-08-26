import * as React from 'react';

import { RegistrationPolicyPreset } from '../FormAdmin/FormItemUtils';

export type RegistrationPolicyPresetSelectorProps = {
  presets?: RegistrationPolicyPreset[];
  preset?: RegistrationPolicyPreset;
  presetSelected: React.Dispatch<React.ChangeEvent<HTMLSelectElement>>;
  allowCustom: boolean;
  custom: boolean;
};

function RegistrationPolicyPresetSelector({
  presets,
  preset,
  presetSelected,
  allowCustom,
  custom,
}: RegistrationPolicyPresetSelectorProps): React.JSX.Element {
  const presetSelectorId = React.useId();

  if (!presets) {
    return <></>;
  }

  if (presets.length === 1 && !allowCustom) {
    return <></>;
  }

  let selectorValue;
  if (preset) {
    selectorValue = preset.name;
  } else if (custom) {
    selectorValue = '_custom';
  }

  const presetOptions = presets.map((p) => (
    <option value={p.name} key={p.name}>
      {p.name}
    </option>
  ));
  if (allowCustom) {
    presetOptions.push(
      <option value="_custom" key="_custom">
        Custom registration policy (advanced)
      </option>,
    );
  }

  return (
    <div className="mb-3">
      <label className="form-label" htmlFor={presetSelectorId}>
        Select policy
        <select id={presetSelectorId} className="form-select" value={selectorValue || ''} onChange={presetSelected}>
          <option value="" disabled>
            Select one...
          </option>
          {presetOptions}
        </select>
      </label>
    </div>
  );
}

export default RegistrationPolicyPresetSelector;
