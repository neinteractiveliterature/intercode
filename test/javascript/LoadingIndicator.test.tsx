import React from 'react';
import { render } from './testUtils';
import LoadingIndicator from '../../app/javascript/LoadingIndicator';

test('it renders with a given size', () => {
  const { getByLabelText } = render(<LoadingIndicator size={2} />);
  expect(getByLabelText('Loading...')).toHaveClass('display-2');
});

test('it renders with size 5 by default', () => {
  const { getByLabelText } = render(<LoadingIndicator />);
  expect(getByLabelText('Loading...')).toHaveClass('display-5');
});
