import React from 'react';
import PropTypes from 'prop-types';
import RequiredIndicator from './RequiredIndicator';

const CaptionLegend = ({ formItem }) => (
  <legend className="col-form-legend">
    <span
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: formItem.properties.caption }}
    />
    <RequiredIndicator formItem={formItem} />
  </legend>
);

CaptionLegend.propTypes = {
  formItem: PropTypes.shape({
    PropTypes: PropTypes.shape({
      caption: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default CaptionLegend;
