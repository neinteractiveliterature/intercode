import { Fragment } from 'react';

const PlainTextDisplay = ({ value }: { value: string }) => {
  let stringValue = value || '';
  if (Array.isArray(value)) {
    stringValue = value.join(', ');
  }

  return <>
    {stringValue.split(/\r?\n/).map((line, i) => (
      // eslint-disable-next-line react/no-array-index-key
      <Fragment key={i}>
        {i > 0 ? <br /> : null}
        {line}
      </Fragment>
    ))}
  </>;
};

export default PlainTextDisplay;
