import React from 'react';
import RequiredIndicator from './RequiredIndicator';
import { ParsedFormItem } from '../../FormAdmin/FormItemUtils';

export type CaptionLabelProps<PropertiesType extends { caption: string; required?: boolean }> = {
  formItem: ParsedFormItem<PropertiesType, any>;
  htmlFor: string;
};

function CaptionLabel<PropertiesType extends { caption: string; required?: boolean }>({
  formItem,
  htmlFor,
}: CaptionLabelProps<PropertiesType>) {
  return (
    <label className="form-item-label" htmlFor={htmlFor}>
      <span
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: formItem.rendered_properties.caption }}
      />
      <RequiredIndicator formItem={formItem} />
    </label>
  );
}

export default CaptionLabel;
