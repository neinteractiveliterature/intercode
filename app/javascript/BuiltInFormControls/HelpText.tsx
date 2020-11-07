import { ReactNode } from 'react';

export type HelpTextProps = {
  children?: ReactNode;
};

function HelpText({ children }: HelpTextProps) {
  if (!children) {
    return null;
  }

  return <small className="form-text text-muted">{children}</small>;
}

export default HelpText;
