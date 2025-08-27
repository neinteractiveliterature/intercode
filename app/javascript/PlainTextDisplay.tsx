import { Fragment } from 'react';

function PlainTextDisplay({ value }: { value: string }): React.JSX.Element {
  let stringValue = value ?? '';
  if (Array.isArray(value)) {
    stringValue = value.join(', ');
  }
  if (typeof stringValue !== 'string') {
    stringValue = `${stringValue}`;
  }

  return (
    <>
      {stringValue.split(/\r?\n/).map((line, i) => (
        <Fragment key={i}>
          {i > 0 ? <br /> : null}
          {line}
        </Fragment>
      ))}
    </>
  );
}

export default PlainTextDisplay;
