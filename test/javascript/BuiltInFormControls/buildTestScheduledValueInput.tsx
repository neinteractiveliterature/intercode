import * as React from 'react';

export default function buildTestScheduledValueInput(
  value: string,
  onChange: React.Dispatch<string>,
): React.JSX.Element {
  const processChangeEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <input
      className="testInput"
      type="text"
      value={value}
      onChange={processChangeEvent}
      aria-label="Test input"
      data-testid="testInput"
    />
  );
}
