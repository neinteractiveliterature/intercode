import React from 'react';
import PropTypes from 'prop-types';

const StaticTextItem = ({ formItem }) => {
  switch (formItem.style) {
  case 'subhead':
    return <div className="lead" dangerouslySetInnerHTML={{ __html: formItem.content }} />;
  default:
    return <div dangerouslySetInnerHTML={{ __html: formItem.content }} />;
  }
};

export default StaticTextItem;