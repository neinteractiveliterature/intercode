import React from 'react';
import PropTypes from 'prop-types';
import useUniqueId from '../useUniqueId';

function RegistrationPolicyPresetSelector({
  presets, preset, presetSelected, allowCustom, custom,
}) {
  const presetSelectorId = useUniqueId('preset-');

  if (!presets) {
    return null;
  }

  if (presets.length === 1 && !allowCustom) {
    return null;
  }

  let selectorValue;
  if (preset) {
    selectorValue = preset.name;
  } else if (custom) {
    selectorValue = '_custom';
  }

  const presetOptions = presets.map((p) => (
    <option value={p.name} key={p.name}>{p.name}</option>
  ));
  if (allowCustom) {
    presetOptions.push(
      <option value="_custom" key="_custom">Custom registration policy (advanced)</option>,
    );
  }

  return (
    <div className="form-group">
      <label htmlFor={presetSelectorId}>
        Select policy
        <select
          id={presetSelectorId}
          className="form-control"
          value={selectorValue || ''}
          onChange={presetSelected}
        >
          <option value="" disabled>Select one...</option>
          {presetOptions}
        </select>
      </label>
    </div>
  );
}

RegistrationPolicyPresetSelector.propTypes = {
  presets: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
  })),
  preset: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
  presetSelected: PropTypes.func.isRequired,
  allowCustom: PropTypes.bool.isRequired,
  custom: PropTypes.bool.isRequired,
};

RegistrationPolicyPresetSelector.defaultProps = {
  presets: null,
  preset: null,
};

export default RegistrationPolicyPresetSelector;
