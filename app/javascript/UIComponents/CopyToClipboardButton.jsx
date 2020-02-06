import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Clipboard from 'react-clipboard.js';

function CopyToClipboardButton({
  copiedProps, defaultText, copiedText, ...otherProps
}) {
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
      {copied ? (copiedText || 'Copied!') : (defaultText || 'Copy to clipboard')}
    </Clipboard>
  );
}

CopyToClipboardButton.propTypes = {
  copiedProps: PropTypes.shape({}),
  defaultText: PropTypes.string,
  copiedText: PropTypes.string,
};

CopyToClipboardButton.defaultProps = {
  copiedProps: {},
  defaultText: null,
  copiedText: null,
};

export default CopyToClipboardButton;
