import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { flatten } from 'lodash';
import { humanize } from 'inflected';
import GraphQLQueryResultWrapper from '../GraphQLQueryResultWrapper';
import GraphQLResultPropType from '../GraphQLResultPropType';

const orderSummaryQuery = gql`
query {
  convention {
    products {
      name

      order_quantities_by_status {
        status
        quantity
      }

      product_variants {
        name

        order_quantities_by_status {
          status
          quantity
        }
      }
    }
  }
}
`;

const ORDER_STATUSES = ['paid', 'unpaid', 'cancelled'];

function statusClass(status) {
  switch (status) {
    case 'paid': return 'table-success';
    case 'unpaid': return 'table-warning';
    case 'cancelled': return 'text-muted';
    default: return '';
  }
}

@graphql(orderSummaryQuery)
@GraphQLQueryResultWrapper
class OrderSummary extends React.Component {
  static propTypes = {
    data: GraphQLResultPropType(orderSummaryQuery).isRequired,
  }

  renderQuantityCell = (quantitiesByStatus, status) => {
    const { quantity } = quantitiesByStatus.find(qbs => qbs.status === status);
    return <td key={status} className={statusClass(status)}>{quantity}</td>;
  }

  renderTotalToPurchaseCell = (quantitiesByStatus) => {
    const total = quantitiesByStatus.reduce((acc, qbs) => {
      if (qbs.status === 'cancelled') {
        return acc;
      }

      return acc + qbs.quantity;
    }, 0);

    return <td key="total-to-purchase" className="table-primary font-weight-bold">{total}</td>;
  }

  renderVariant = (variant) => {
    const quantityCells = ORDER_STATUSES
      .map(status => this.renderQuantityCell(variant.order_quantities_by_status, status));

    return (
      <tr key={`variant-${variant.id}`}>
        <th scope="row" className="font-weight-normal pl-4">{variant.name}</th>
        {this.renderTotalToPurchaseCell(variant.order_quantities_by_status)}
        {quantityCells}
      </tr>
    );
  }

  renderProduct = (product) => {
    if (product.product_variants.length > 0) {
      return [
        <tr key={`product-${product.id}`}>
          <th scope="row">{product.name}</th>
          <td colSpan={ORDER_STATUSES.length} />
        </tr>,
        ...product.product_variants.map(variant => this.renderVariant(variant)),
      ];
    }

    const quantityCells = ORDER_STATUSES
      .map(status => this.renderQuantityCell(product.order_quantities_by_status, status));

    return [
      <tr key={`product-${product.id}`}>
        <th scope="row">{product.name}</th>
        {this.renderTotalToPurchaseCell(product.order_quantities_by_status)}
        {quantityCells}
      </tr>,
    ];
  }

  render = () => {
    const products = this.props.data.convention.products
      .map(product => this.renderProduct(product));

    return (
      <table className="table">
        <thead>
          <tr>
            <th>Product</th>
            <th className="table-primary">Total to purchase</th>
            {ORDER_STATUSES.map(status => (
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
}

export default OrderSummary;
