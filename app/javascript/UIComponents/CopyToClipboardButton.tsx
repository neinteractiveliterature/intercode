import React, { useState, ReactNode } from 'react';
import ClipboardButton from 'react-clipboard.js';

export type CopyToClipboardButtonProps = ClipboardButton['props'] & {
  copiedProps: ClipboardButton['props'],
  defaultText?: ReactNode,
  copiedText?: ReactNode,
};

function CopyToClipboardButton({
  copiedProps, defaultText, copiedText, ...otherProps
}: CopyToClipboardButtonProps) {
  const [copied, setCopied] = useState(false);

  const onSuccess = () => {
    if (copied) {
      return;
    }

    setCopied(true);
    window.setTimeout(() => { setCopied(false); }, 2000);
  };

  return (
    <ClipboardButton
      {...otherProps}
      {...copied ? (copiedProps ?? {}) : {}}
      onSuccess={onSuccess}
    >
      <i className="fa fa-copy" />
      {' '}
      {copied ? (copiedText ?? 'Copied!') : (defaultText ?? 'Copy to clipboard')}
    </ClipboardButton>
  );
}

export default CopyToClipboardButton;
