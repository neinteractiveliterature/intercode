import { MockLink } from '@apollo/client/testing';

import { renderRoute, waitFor } from '../testUtils';
import { Component as OrderSummary, loader } from '../../../app/javascript/Store/OrderSummary';
import { OrderSummaryQueryData, OrderSummaryQueryDocument } from '../../../app/javascript/Store/queries.generated';

type SummaryProduct = OrderSummaryQueryData['convention']['products'][number];
type Quantities = SummaryProduct['order_quantities_by_status'];

const quantities = (byStatus: Record<string, number>): Quantities =>
  Object.entries(byStatus).map(([status, quantity]) => ({
    __typename: 'OrderQuantityByStatus',
    status,
    quantity,
  }));

const buildProduct = (overrides: Partial<SummaryProduct> & Pick<SummaryProduct, 'id' | 'name'>): SummaryProduct => ({
  __typename: 'Product',
  order_quantities_by_status: [],
  product_variants: [],
  ...overrides,
});

describe('OrderSummary', () => {
  const renderSummary = (products: SummaryProduct[]) => {
    const mock: MockLink.MockedResponse<OrderSummaryQueryData> = {
      request: { query: OrderSummaryQueryDocument },
      result: { data: { __typename: 'Query', convention: { __typename: 'Convention', id: '1', products } } },
    };

    return renderRoute([{ path: '/order_summary', loader, Component: OrderSummary }], {
      apolloMocks: [mock],
      initialEntries: ['/order_summary'],
    });
  };

  // The cells of a table row, as text, in order (the first is the product or variant name)
  const rowCells = (row: HTMLElement) => Array.from(row.querySelectorAll('th, td')).map((cell) => cell.textContent);

  it('has a column for the total to purchase and one for each of paid, unpaid and cancelled', async () => {
    const { findByRole, getAllByRole } = await renderSummary([]);

    await findByRole('table');
    expect(rowCells(getAllByRole('row')[0])).toEqual(['Product', 'Total to purchase', 'Paid', 'Unpaid', 'Cancelled']);
  });

  it('shows quantities by status for a product, with a total that leaves out cancelled orders', async () => {
    const { findByRole } = await renderSummary([
      buildProduct({
        id: '1',
        name: 'T-shirt',
        order_quantities_by_status: quantities({ paid: 5, unpaid: 2, cancelled: 3 }),
      }),
    ]);

    const row = (await findByRole('row', { name: /T-shirt/ })) as HTMLElement;

    expect(rowCells(row)).toEqual(['T-shirt', '7', '5', '2', '3']);
  });

  it('leaves the cell blank for a status with no orders', async () => {
    const { findByRole } = await renderSummary([
      buildProduct({ id: '1', name: 'Mug', order_quantities_by_status: quantities({ paid: 4 }) }),
    ]);

    const row = (await findByRole('row', { name: /Mug/ })) as HTMLElement;

    expect(rowCells(row)).toEqual(['Mug', '4', '4', '', '']);
  });

  it('shows a total of 0 for a product nobody has ordered', async () => {
    const { findByRole } = await renderSummary([buildProduct({ id: '1', name: 'Poster' })]);

    expect(rowCells((await findByRole('row', { name: /Poster/ })) as HTMLElement)).toEqual(['Poster', '0', '', '', '']);
  });

  it('shows a product with variants as a heading row followed by one row per variant', async () => {
    const { findByRole, getAllByRole } = await renderSummary([
      buildProduct({
        id: '1',
        name: 'Hoodie',
        product_variants: [
          {
            __typename: 'ProductVariant',
            id: '10',
            name: 'Small',
            order_quantities_by_status: quantities({ paid: 3, unpaid: 1 }),
          },
          {
            __typename: 'ProductVariant',
            id: '11',
            name: 'Large',
            order_quantities_by_status: quantities({ paid: 2, cancelled: 1 }),
          },
        ],
      }),
    ]);

    await findByRole('row', { name: /Hoodie/ });
    const rows = getAllByRole('row').slice(1);

    expect(rows.map((row) => rowCells(row).slice(0, 2))).toEqual([
      ['Hoodie', ''],
      ['Small', '4'],
      ['Large', '2'],
    ]);
    expect(rowCells(rows[1])).toEqual(['Small', '4', '3', '1', '']);
    expect(rowCells(rows[2])).toEqual(['Large', '2', '2', '', '1']);
  });

  it('sets the page title', async () => {
    await renderSummary([]);

    await waitFor(() => expect(document.title).toContain('Order summary'));
  });
});
