import React from 'react';
import PropTypes from 'prop-types';
import { ChromePicker } from 'react-color';
import tinycolor2 from 'tinycolor2';

function decodeValue(value) {
  return tinycolor2(value).toRgb();
}

function encodeValue(value) {
  if (value.rgb.a === 1.0) {
    return tinycolor2(value.rgb).toHexString();
  }

  return tinycolor2(value.rgb).toRgbString();
}

function SyncColorPicker({ value, onChange }) {
  return (
    <ChromePicker
      color={decodeValue(value)}
      onChangeComplete={(newValue) => { onChange(encodeValue(newValue)); }}
    />
  );
}

SyncColorPicker.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

SyncColorPicker.defaultProps = {
  value: null,
};

export default SyncColorPicker;
