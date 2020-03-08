import React from 'react';
import PropTypes from 'prop-types';

import SelectWithLabel from './SelectWithLabel';

function OrganizationSelect({
  organizations, label, ...props
}) {
  return (
    <SelectWithLabel
      label={label || 'Organization'}
      options={organizations}
      getOptionValue={(organization) => organization.id}
      getOptionLabel={(organization) => organization.name}
      {...props}
    />
  );
}

OrganizationSelect.propTypes = {
  organizations: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  label: PropTypes.string,
};

OrganizationSelect.defaultProps = {
  label: null,
};

export default OrganizationSelect;
