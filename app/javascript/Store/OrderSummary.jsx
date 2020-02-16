import React from 'react';
import flatten from 'lodash-es/flatten';
import { humanize } from 'inflected';
import { useQuery } from 'react-apollo-hooks';

import { OrderSummaryQuery } from './queries.gql';
import ErrorDisplay from '../ErrorDisplay';
import usePageTitle from '../usePageTitle';
import PageLoadingIndicator from '../PageLoadingIndicator';

const ORDER_STATUSES = ['paid', 'unpaid', 'cancelled'];

function statusClass(status) {
  switch (status) {
    case 'paid': return 'table-success';
    case 'unpaid': return 'table-warning';
    case 'cancelled': return 'text-muted';
    default: return '';
  }
}

function OrderSummary() {
  usePageTitle('Order summary');
  const { data, loading, error } = useQuery(OrderSummaryQuery);

  const renderQuantityCell = (quantitiesByStatus, status) => {
    const { quantity } = quantitiesByStatus.find((qbs) => qbs.status === status);
    return <td key={status} className={statusClass(status)}>{quantity}</td>;
  };

  const renderTotalToPurchaseCell = (quantitiesByStatus) => {
    const total = quantitiesByStatus.reduce((acc, qbs) => {
      if (qbs.status === 'cancelled') {
        return acc;
      }

      return acc + qbs.quantity;
    }, 0);

    return <td key="total-to-purchase" className="table-primary font-weight-bold">{total}</td>;
  };

  const renderVariant = (variant) => {
    const quantityCells = ORDER_STATUSES
      .map((status) => renderQuantityCell(variant.order_quantities_by_status, status));

    return (
      <tr key={`variant-${variant.id}`}>
        <th scope="row" className="font-weight-normal pl-4">{variant.name}</th>
        {renderTotalToPurchaseCell(variant.order_quantities_by_status)}
        {quantityCells}
      </tr>
    );
  };

  const renderProduct = (product) => {
    if (product.product_variants.length > 0) {
      return [
        <tr key={`product-${product.id}`}>
          <th scope="row">{product.name}</th>
          <td colSpan={ORDER_STATUSES.length} />
        </tr>,
        ...product.product_variants.map((variant) => renderVariant(variant)),
      ];
    }

    const quantityCells = ORDER_STATUSES
      .map((status) => renderQuantityCell(product.order_quantities_by_status, status));

    return [
      <tr key={`product-${product.id}`}>
        <th scope="row">{product.name}</th>
        {renderTotalToPurchaseCell(product.order_quantities_by_status)}
        {quantityCells}
      </tr>,
    ];
  };

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const products = data.convention.products.map((product) => renderProduct(product));

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Product</th>
          <th className="table-primary">Total to purchase</th>
          {ORDER_STATUSES.map((status) => (
            <th key={status} className={statusClass(status)}>{humanize(status)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {flatten(products)}
      </tbody>
    </table>
  );
}

export default OrderSummary;
