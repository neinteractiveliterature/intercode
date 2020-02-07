import React from 'react';
import PropTypes from 'prop-types';

function Gravatar({ url, enabled, pixelSize }) {
  if (!url || !enabled) {
    return (
      <span className="d-inline-block" style={{ width: `${pixelSize}px`, height: `${pixelSize}px` }}>
        <i className="fa fa-user-circle" style={{ fontSize: `${pixelSize}px` }} />
      </span>
    );
  }

  return (
    <img
      src={`${url}?s=${pixelSize * 2}`} // for retina displays
      alt=""
      className="border-secondary"
      style={{
        width: `${pixelSize}px`,
        height: `${pixelSize}px`,
        borderRadius: `${pixelSize / 2}px`,
        borderStyle: 'solid',
        borderWidth: `${pixelSize / 16}px`,
      }}
    />
  );
}

Gravatar.propTypes = {
  url: PropTypes.string,
  enabled: PropTypes.bool,
  pixelSize: PropTypes.number.isRequired,
};

Gravatar.defaultProps = {
  url: null,
  enabled: true,
};

export default Gravatar;
