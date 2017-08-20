// @flow

import React from 'react';
import FormItem from '../../Models/FormItem';

type Props = {
  formItem: FormItem,
};

const RequiredIndicator = ({ formItem }: Props) => {
  if (formItem.properties.required) {
    return (<span className="text-danger ml-1">*</span>);
  }

  return <span />;
};

export default RequiredIndicator;
