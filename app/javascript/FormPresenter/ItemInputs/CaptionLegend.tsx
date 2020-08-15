import React from 'react';
import RequiredIndicator from './RequiredIndicator';
import { ParsedFormItem } from '../../FormAdmin/FormItemUtils';

export type CaptionLegendProps<PropertiesType extends { caption: string; required?: boolean }> = {
  formItem: ParsedFormItem<PropertiesType, any>;
};

function CaptionLegend<PropertiesType extends { caption: string; required?: boolean }>({
  formItem,
}: CaptionLegendProps<PropertiesType>) {
  return (
    <legend className="col-form-label">
      <span
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: formItem.rendered_properties.caption }}
      />
      <RequiredIndicator formItem={formItem} />
    </legend>
  );
}

export default CaptionLegend;
