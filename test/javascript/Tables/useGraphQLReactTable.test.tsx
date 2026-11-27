import { TypedDocumentNode } from '@apollo/client';
import { MockLink } from '@apollo/client/testing';
import { MockedProvider } from '@apollo/client/testing/react';
import { renderHook, waitFor } from '@testing-library/react';
import { parse } from 'graphql';

import useGraphQLReactTable, { GraphQLReactTableVariables } from '../../../app/javascript/Tables/useGraphQLReactTable';

type QueryData = { things: { entries: { name: string }[]; total_pages: number } };

const query = parse(`
  query Things($page: Int, $perPage: Int, $filters: JSON, $sort: JSON) {
    things(page: $page, perPage: $perPage, filters: $filters, sort: $sort) {
      entries {
        name
      }
      total_pages
    }
  }
`) as TypedDocumentNode<QueryData, GraphQLReactTableVariables>;

const mockPage = (page: number, name: string, delay: number): MockLink.MockedResponse => ({
  request: { query, variables: (variables: GraphQLReactTableVariables) => variables.page === page + 1 },
  result: { data: { things: { entries: [{ name }], total_pages: 2 } } },
  delay,
});

describe('useGraphQLReactTable', () => {
  const renderTableHook = () =>
    renderHook(
      ({ page }) =>
        useGraphQLReactTable({
          query,
          page,
          getData: ({ data }) => data.things.entries,
          getPages: ({ data }) => data.things.total_pages,
        }),
      {
        initialProps: { page: 0 },
        wrapper: ({ children }) => (
          <MockedProvider mocks={[mockPage(0, 'First', 0), mockPage(1, 'Second', 50)]}>{children}</MockedProvider>
        ),
      },
    );

  it('keeps showing the previous page while the next one loads', async () => {
    const { result, rerender } = renderTableHook();
    expect(result.current.data).toEqual([]);
    await waitFor(() => expect(result.current.loading).toBe(false));
    const firstRows = result.current.data;

    rerender({ page: 1 });

    expect(result.current.loading).toBe(true);
    // the same array, not just equal rows, so that the table does not see a change
    expect(result.current.data).toBe(firstRows);
    expect(result.current.pages).toBe(2);
    expect(result.current.queryData?.things.entries).toEqual([{ name: 'First' }]);

    await waitFor(() => expect(result.current.data).toEqual([{ name: 'Second' }]));
  });
});
