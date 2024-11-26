import flatten from 'lodash/flatten';

import usePageTitle from '../usePageTitle';
import { OrderQuantityByStatus, OrderStatus } from '../graphqlTypes.generated';
import { OrderSummaryQueryData, OrderSummaryQueryDocument } from './queries.generated';
import humanize from '../humanize';
import { LoaderFunction, useLoaderData } from 'react-router';
import { client } from '../useIntercodeApolloClient';

const ORDER_STATUSES = [OrderStatus.Paid, OrderStatus.Unpaid, OrderStatus.Cancelled];

type ProductType = OrderSummaryQueryData['convention']['products'][0];

function statusClass(status: OrderStatus) {
  switch (status) {
    case 'paid':
      // eslint-disable-next-line i18next/no-literal-string
      return 'table-success';
    case 'unpaid':
      // eslint-disable-next-line i18next/no-literal-string
      return 'table-warning';
    case 'cancelled':
      // eslint-disable-next-line i18next/no-literal-string
      return 'text-muted';
    default:
      return '';
  }
}

export const loader: LoaderFunction = async () => {
  const { data } = await client.query<OrderSummaryQueryData>({ query: OrderSummaryQueryDocument });
  return data;
};

function OrderSummary() {
  const data = useLoaderData() as OrderSummaryQueryData;
  usePageTitle('Order summary');

  const renderQuantityCell = (quantitiesByStatus: OrderQuantityByStatus[], status: OrderStatus) => {
    const quantityByStatus = quantitiesByStatus.find((qbs) => qbs.status === status);

    if (!quantityByStatus) {
      return <td key={status} />;
    }

    return (
      <td key={status} className={statusClass(status)}>
        {quantityByStatus.quantity}
      </td>
    );
  };

  const renderTotalToPurchaseCell = (quantitiesByStatus: OrderQuantityByStatus[]) => {
    const total = quantitiesByStatus.reduce((acc, qbs) => {
      if (qbs.status === 'cancelled') {
        return acc;
      }

      return acc + qbs.quantity;
    }, 0);

    return (
      <td key="total-to-purchase" className="table-primary fw-bold">
        {total}
      </td>
    );
  };

  const renderVariant = (variant: ProductType['product_variants'][0]) => {
    const quantityCells = ORDER_STATUSES.map((status) =>
      renderQuantityCell(variant.order_quantities_by_status, status),
    );

    return (
      <tr key={`variant-${variant.id}`}>
        <th scope="row" className="fw-normal ps-4">
          {variant.name}
        </th>
        {renderTotalToPurchaseCell(variant.order_quantities_by_status)}
        {quantityCells}
      </tr>
    );
  };

  const renderProduct = (product: ProductType) => {
    if (product.product_variants.length > 0) {
      return [
        <tr key={`product-${product.id}`}>
          <th scope="row">{product.name}</th>
          <td colSpan={ORDER_STATUSES.length} />
        </tr>,
        ...product.product_variants.map((variant) => renderVariant(variant)),
      ];
    }

    const quantityCells = ORDER_STATUSES.map((status) =>
      renderQuantityCell(product.order_quantities_by_status, status),
    );

    return [
      <tr key={`product-${product.id}`}>
        <th scope="row">{product.name}</th>
        {renderTotalToPurchaseCell(product.order_quantities_by_status)}
        {quantityCells}
      </tr>,
    ];
  };

  const products = data.convention.products.map((product) => renderProduct(product));

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Product</th>
          <th className="table-primary">Total to purchase</th>
          {ORDER_STATUSES.map((status) => (
            <th key={status} className={statusClass(status)}>
              {humanize(status)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{flatten(products)}</tbody>
    </table>
  );
}

export default OrderSummary;
