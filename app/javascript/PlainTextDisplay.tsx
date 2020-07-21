import React from 'react';

const PlainTextDisplay = ({ value }: { value: string }) => {
  let stringValue = value || '';
  if (Array.isArray(value)) {
    stringValue = value.join(', ');
  }

  return (
    <>
      {stringValue.split(/\r?\n/).map((line, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <React.Fragment key={i}>
          {i > 0 ? <br /> : null}
          {line}
        </React.Fragment>
      ))}
    </>
  );
};

export default PlainTextDisplay;
