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
            <>
              &#8203;.
            </>
          )
          : null
      }
    </React.Fragment>
  ));

  return (
    <>
      <span className="text-nowrap">{'{{ '}</span>
      {parts}
      <span className="text-nowrap">{' }}'}</span>
    </>
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
