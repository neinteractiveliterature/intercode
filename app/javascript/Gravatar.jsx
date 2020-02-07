import React from 'react';
import PropTypes from 'prop-types';

function Gravatar({
  url, enabled, pixelSize, imgClassName,
}) {
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
      className={`${imgClassName || ''}`}
      style={{
        width: `${pixelSize}px`,
        height: `${pixelSize}px`,
        borderRadius: `${pixelSize / 2}px`,
      }}
    />
  );
}

Gravatar.propTypes = {
  url: PropTypes.string,
  enabled: PropTypes.bool,
  pixelSize: PropTypes.number.isRequired,
  imgClassName: PropTypes.string,
};

Gravatar.defaultProps = {
  url: null,
  enabled: true,
  imgClassName: null,
};

export default Gravatar;
