import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Clipboard from 'react-clipboard.js';

function CopyToClipboardButton({ copiedProps, ...otherProps }) {
  const [copied, setCopied] = useState(false);

  const onSuccess = () => {
    if (copied) {
      return;
    }

    setCopied(true);
    window.setTimeout(() => { setCopied(false); }, 2000);
  };

  return (
    <Clipboard
      {...otherProps}
      {...copied ? (copiedProps || {}) : {}}
      onSuccess={onSuccess}
    >
      <i className="fa fa-copy" />
      {' '}
      {copied ? 'Copied!' : 'Copy to clipboard'}
    </Clipboard>
  );
}

CopyToClipboardButton.propTypes = {
  copiedProps: PropTypes.shape({}),
};

CopyToClipboardButton.defaultProps = {
  copiedProps: {},
};

export default CopyToClipboardButton;
