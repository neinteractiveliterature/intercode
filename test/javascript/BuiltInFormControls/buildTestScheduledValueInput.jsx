import React from 'react';

export default function buildTestScheduledValueInput(value, onChange) {
  const processChangeEvent = (event) => {
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
