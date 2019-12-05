import React from 'react';

import { render } from './testUtils';
import ErrorDisplay from '../../app/javascript/ErrorDisplay';

test('it renders a string error', () => {
  const { container } = render(<ErrorDisplay stringError="everything is borked" />);

  expect(container.innerHTML).toMatch(/everything is borked/);
});

test('it renders a graphql error', () => {
  const { getAllByText } = render(<ErrorDisplay
    graphQLError={{
      graphQLErrors: [
        { message: 'everything ' },
        { message: 'is borked' },
      ],
    }}
  />);

  expect(getAllByText('everything')).toHaveLength(1);
  expect(getAllByText('is borked')).toHaveLength(1);
});

test('it renders nothing by default', () => {
  const { getByTestId } = render(<ErrorDisplay />, { wrapper: () => <div data-testid="wrapper" /> });
  expect(getByTestId('wrapper').children.length).toEqual(0);
});
