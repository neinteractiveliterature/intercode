import React from 'react';
import PropTypes from 'prop-types';

function AssignName({ assign, prefix = null }) {
  const concatenatedName = `${prefix || ''}${assign.name}`;
  const rawParts = concatenatedName.split('.');
  const parts = rawParts.map((part, i) => (
    // eslint-disable-next-line react/no-array-index-key
    <React.Fragment key={i}>
      <span className="text-nowrap">{part}</span>
      {
        i < rawParts.length - 1
          ? (
            <React.Fragment>
              &#8203;.
            </React.Fragment>
          )
          : null
      }
    </React.Fragment>
  ));

  return (
    <React.Fragment>
      <span className="text-nowrap">{'{{ '}</span>
      {parts}
      <span className="text-nowrap">{' }}'}</span>
    </React.Fragment>
  );
}

AssignName.propTypes = {
  assign: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  prefix: PropTypes.string,
};

AssignName.defaultProps = {
  prefix: null,
};

export default AssignName;
