import * as React from 'react';
import { ChromePicker, ColorResult } from 'react-color';
import tinycolor2 from 'tinycolor2';

function decodeValue(value?: string | null) {
  return tinycolor2(value ?? undefined).toRgb();
}

function encodeValue(value: ColorResult) {
  if (value.rgb.a === 1.0) {
    return tinycolor2(value.rgb).toHexString();
  }

  return tinycolor2(value.rgb).toRgbString();
}

export type SyncColorPickerProps = {
  value?: string | null;
  onChange: React.Dispatch<string>;
};

function SyncColorPicker({ value, onChange }: SyncColorPickerProps): React.JSX.Element {
  return (
    <ChromePicker
      color={decodeValue(value)}
      onChangeComplete={(newValue) => {
        onChange(encodeValue(newValue));
      }}
    />
  );
}

export default SyncColorPicker;
