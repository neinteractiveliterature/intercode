import React, { InputHTMLAttributes } from 'react';

export type EmailAliasInputProps = InputHTMLAttributes<HTMLInputElement> & {
  onTextChange: (value: string) => void,
  domain: string,
};

function EmailAliasInput({ onTextChange, domain, ...otherProps }: EmailAliasInputProps) {
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

export default EmailAliasInput;
