import React from 'react';

import { ParsedFormItem } from '../../FormAdmin/FormItemUtils';

export type RequiredIndicatorProps<PropertiesType extends { required?: boolean }> = {
  formItem: ParsedFormItem<PropertiesType, any>;
};

const RequiredIndicator = <PropertiesType extends { required?: boolean }>({
  formItem,
}: RequiredIndicatorProps<PropertiesType>) => {
  if (formItem.rendered_properties.required) {
    return (
      <span className="text-danger ml-1" aria-label="Required">
        *
      </span>
    );
  }

  return <span />;
};

export default RequiredIndicator;
