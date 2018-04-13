import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment-timezone';
import GraphQLQueryResultWrapper from '../GraphQLQueryResultWrapper';
import GraphQLResultPropType from '../GraphQLResultPropType';
import OrderPaymentModal from './OrderPaymentModal';
import formatMoney from '../formatMoney';

const orderHistoryQuery = gql`
query {
  convention {
    name
    timezone_name

    staff_positions {
      name
      email
    }
  }

  myProfile {
    name_without_nickname

    orders {
      id
      status
      submitted_at

      total_price {
        fractional
        currency_code
      }

      payment_amount {
        fractional
        currency_code
      }

      order_entries {
        id
        quantity

        product {
          name
          image_url
        }

        product_variant {
          name
          image_url
        }

        price_per_item {
          fractional
          currency_code
        }

        price {
          fractional
          currency_code
        }
      }
    }
  }
}
`;

@graphql(orderHistoryQuery)
@GraphQLQueryResultWrapper
class OrderHistory extends React.Component {
  static propTypes = {
    data: GraphQLResultPropType(orderHistoryQuery).isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      payingForOrder: null,
    };
  }

  payNowClicked = (order) => {
    this.setState({ payingForOrder: order });
  }

  payNowCanceled = () => {
    this.setState({ payingForOrder: null });
  }

  payNowComplete = () => {
    this.setState({ payingForOrder: null });
  }

  renderOrderEntry = (orderEntry) => {
    const productVariant = orderEntry.product_variant || {};
    const name = orderEntry.product.name + (
      productVariant.name ? ` (${productVariant.name})` : ''
    );
    const imageUrl = productVariant.image_url || orderEntry.product.image_url;

    return (
      <div key={orderEntry.id}>
        <div className="media mt-2">
          {
            imageUrl ?
            (<img className="mr-4" src={imageUrl} alt={name} style={{ width: '100px' }} />) :
            <div style={{ width: '100px' }} />
          }
          <div className="media-body mt-2">
            <div className="row align-items-center">
              <div className="col-md-6"><strong>{name}</strong></div>
              <div className="col-md-3 text-right">{orderEntry.quantity}</div>
              <div className="col-md-3 text-right">{formatMoney(orderEntry.price)}</div>
            </div>
          </div>
        </div>
        <hr />
      </div>
    );
  }

  renderOrderStatus = (order) => {
    if (order.status === 'paid') {
      const opsPosition = this.props.data.convention.staff_positions
        .find(staffPosition => staffPosition.name === 'Operations Coordinator');
      const opsEmail = (opsPosition || {}).email;
      const emailSubject = `[${this.props.data.convention.name}] Cancellation request: order ${order.id}`;
      const emailBody = `I would like to request that order ${order.id} be canceled.`;

      return [
        <div key="status">
          <div className="badge badge-success">
            <div className="lead">Paid</div>
          </div>
        </div>,
        opsEmail ? (
          <a href={`mailto:${opsEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`} key="cancellation-link">
            <small>Request cancellation</small>
          </a>
        ) : null,
      ];
    } else if (order.status === 'cancelled') {
      return (
        <div key="status">
          <div className="badge badge-danger">
            <div className="lead">Canceled</div>
          </div>
        </div>
      );
    }

    return [
      <div key="status">
        <div className="badge badge-warning">
          <div className="lead">Pay at convention</div>
        </div>
      </div>,
      <button
        className="btn btn-sm btn-outline-success mt-2"
        key="pay-now-button"
        onClick={() => { this.payNowClicked(order); }}
      >
        Pay now
      </button>,
    ];
  }

  renderOrder = (order) => {
    const renderedOrderEntries = order.order_entries.map(entry => this.renderOrderEntry(entry));
    const submittedTime = moment(order.submitted_at).tz(this.props.data.convention.timezone_name);

    return (
      <li key={order.id} className="card mb-4">
        <div className="d-flex card-header">
          <div className="col">
            <h3>Order #{order.id}</h3>
            <small>{submittedTime.format('dddd, MMMM D, YYYY, h:mma')}</small>
          </div>
          <div className="text-right">
            {this.renderOrderStatus(order)}
          </div>
        </div>
        <div className="pl-4 card-body">
          {renderedOrderEntries}
          <div className="text-right">
            <strong>
              Total: {formatMoney(order.total_price)}
            </strong>
          </div>
        </div>
      </li>
    );
  }

  render = () => {
    const { orders } = this.props.data.myProfile;

    if (orders.length > 0) {
      const renderedOrders = orders.map(order => this.renderOrder(order));
      return (
        <ul className="list-unstyled">
          {renderedOrders}

          <OrderPaymentModal
            visible={this.state.payingForOrder != null}
            onCancel={this.payNowCanceled}
            initialName={this.props.data.myProfile.name_without_nickname}
            orderId={(this.state.payingForOrder || { id: 0 }).id}
            onComplete={this.payNowComplete}
            allowPayLater={false}
          />
        </ul>
      );
    }

    return (
      <div>No orders to display.</div>
    );
  }
}

export default OrderHistory;
