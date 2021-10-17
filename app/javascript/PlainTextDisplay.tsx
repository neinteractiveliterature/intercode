import { Fragment } from 'react';

function PlainTextDisplay({ value }: { value: string }): JSX.Element {
  let stringValue = value || '';
  if (Array.isArray(value)) {
    stringValue = value.join(', ');
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
