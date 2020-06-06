import React from 'react';
import PropTypes from 'prop-types';

function MenuIcon({ icon, colorClass }) {
  return (
    <div className={`d-inline-block mr-2 ${colorClass ?? 'text-muted'}`} style={{ width: '1em' }}>
      <i className={`fa ${icon}`} />
    </div>
  );
}

MenuIcon.propTypes = {
  icon: PropTypes.string.isRequired,
  colorClass: PropTypes.string,
};

MenuIcon.defaultProps = {
  colorClass: null,
};

export default MenuIcon;
