import React from 'react';
import PropTypes from 'prop-types';

const StaticTextItem = ({ formItem }) => {
  switch (formItem.properties.style) {
    case 'subhead':
      // eslint-disable-next-line react/no-danger
      return <div className="lead" dangerouslySetInnerHTML={{ __html: formItem.properties.content }} />;
    default:
      // eslint-disable-next-line react/no-danger
      return <div dangerouslySetInnerHTML={{ __html: formItem.properties.content }} />;
  }
};

StaticTextItem.propTypes = {
  formItem: PropTypes.shape({
    properties: PropTypes.shape({
      content: PropTypes.string.isRequired,
      style: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default StaticTextItem;
