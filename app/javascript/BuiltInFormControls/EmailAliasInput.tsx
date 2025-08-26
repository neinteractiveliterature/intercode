import { InputHTMLAttributes } from 'react';

export type EmailAliasInputProps = InputHTMLAttributes<HTMLInputElement> & {
  onTextChange: (value: string) => void;
  domain?: string | null;
};

function EmailAliasInput({ onTextChange, domain, ...otherProps }: EmailAliasInputProps): React.JSX.Element {
  return (
    <div className="input-group">
      <input
        className="form-control"
        onChange={(event) => {
          onTextChange(event.target.value);
        }}
        {...otherProps}
      />
      {domain && <span className="input-group-text">@{domain}</span>}
    </div>
  );
}

export default EmailAliasInput;
