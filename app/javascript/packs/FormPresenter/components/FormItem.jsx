import React from 'react';
import PropTypes from 'prop-types';
import FreeTextItem from './FreeTextItem';
import StaticTextItem from './StaticTextItem';

const FormItem = ({ formItem }) => {
  switch (formItem.item_type) {
  case 'free_text':
    return <FreeTextItem formItem={formItem} />;
  case 'static_text':
    return <StaticTextItem formItem={formItem} />;
  default:
    return <div><code>{formItem.identifier}</code></div>;
  }
};

export default FormItem;