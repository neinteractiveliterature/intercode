import React from 'react';
import PropTypes from 'prop-types';

function EmailAliasInput({ onTextChange, domain, ...otherProps }) {
  return (
    <div className="input-group">
      <input
        className="form-control"
        onChange={(event) => {
          onTextChange(event.target.value);
        }}
        {...otherProps}
      />
      <div className="input-group-append">
        <span className="input-group-text">
          @
          {domain}
        </span>
      </div>
    </div>
  );
}

EmailAliasInput.propTypes = {
  onTextChange: PropTypes.func.isRequired,
  domain: PropTypes.string.isRequired,
};

export default EmailAliasInput;
