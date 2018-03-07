import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { enableUniqueIds } from 'react-html-id';
import ErrorDisplay from '../ErrorDisplay';
import GraphQLQueryResultWrapper from '../GraphQLQueryResultWrapper';
import GraphQLResultPropType from '../GraphQLResultPropType';
import LoadingIndicator from '../LoadingIndicator';

const productQuery = gql`
query($productId: Int!) {
  product(id: $productId) {
    price {
      fractional
    }

    product_variants {
      id
      name
      override_price {
        fractional
      }
    }
  }
}
`;

const addOrderEntryToCurrentPendingOrderMutation = gql`
mutation($input: AddOrderEntryToCurrentPendingOrderInput!) {
  addOrderEntryToCurrentPendingOrder(input: $input) {
    order_entry {
      id
    }
  }
}
`;

@compose(
  graphql(productQuery),
  graphql(addOrderEntryToCurrentPendingOrderMutation, {
    props: ({ mutate }) => ({
      addOrderEntryToCurrentPendingOrder: (productId, productVariantId, quantity) => mutate({
        variables: {
          input: {
            order_entry: {
              product_id: productId,
              product_variant_id: productVariantId,
              quantity,
            },
          },
        },
      }),
    }),
  }),
)
@GraphQLQueryResultWrapper
class ProductOrderForm extends React.Component {
  static propTypes = {
    productId: PropTypes.number.isRequired,
    data: GraphQLResultPropType(productQuery).isRequired,
    addOrderEntryToCurrentPendingOrder: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    enableUniqueIds(this);

    this.state = {
      productVariantId: null,
      quantity: 1,
      error: null,
      submitting: false,
    };
  }

  isDataComplete = () => (
    (
      this.props.data.product.product_variants.length < 1 ||
      this.state.productVariantId != null
    ) &&
    this.state.quantity > 0
  )

  productVariantSelectorChanged = (event) => {
    const id = Number.parseInt(event.target.value, 10);
    this.setState({ productVariantId: (Number.isNaN(id) ? null : id) });
  }

  quantityChanged = (event) => {
    const quantity = Number.parseInt(event.target.value, 10);
    this.setState({ quantity: (Number.isNaN(quantity) ? null : quantity) });
  }

  addToCartClicked = async () => {
    try {
      this.setState({ error: null, submitting: true });
      await this.props.addOrderEntryToCurrentPendingOrder(
        this.props.productId,
        this.state.productVariantId,
        this.state.quantity,
      );

      alert('success!');
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ submitting: false });
    }
  }

  renderVariantSelect = () => {
    if (this.props.data.product.product_variants.length < 1) {
      return null;
    }

    const options = this.props.data.product.product_variants.map((variant) => {
      const { id, name, override_price: overridePrice } = variant;

      let overridePriceDescription = '';
      if (overridePrice && overridePrice.fractional !== this.props.data.product.price.fractional) {
        const diff = overridePrice.fractional - this.props.data.product.price.fractional;
        const sign = Math.sign(diff) < 0 ? '-' : '+';
        overridePriceDescription = ` (${sign}$${(diff / 100.0).toFixed(2)})`;
      }

      return (
        <option key={id} value={id}>{name}{overridePriceDescription}</option>
      );
    });

    return (
      <select
        className="form-control mb-3"
        value={this.state.productVariantId}
        onChange={this.productVariantSelectorChanged}
      >
        <option disabled selected={this.state.productVariantId == null}>Select...</option>
        {options}
      </select>
    );
  }

  renderQuantity = () => {
    const inputId = this.nextUniqueId();

    return (
      <div className="d-flex mb-4 align-items-baseline">
        <label className="mr-2" htmlFor={inputId}>Quantity:</label>
        <input
          id={inputId}
          type="number"
          min="1"
          className="form-control"
          value={this.state.quantity == null ? '' : this.state.quantity}
          onChange={this.quantityChanged}
        />
      </div>
    );
  }

  renderTotalAmount = () => {
    if (!this.isDataComplete()) {
      return null;
    }

    let pricePerItem = this.props.data.product.price.fractional;
    if (this.state.productVariantId) {
      const productVariant = this.props.data.product.product_variants
        .find(variant => variant.id === this.state.productVariantId);

      if (productVariant.override_price != null) {
        pricePerItem = productVariant.override_price.fractional;
      }
    }

    const totalPrice = pricePerItem * this.state.quantity;

    return (
      <strong>Total: ${(totalPrice / 100.0).toFixed(2)}</strong>
    );
  }

  render = () => (
    <div className="card bg-light">
      <div className="card-body">
        {this.renderVariantSelect()}
        {this.renderQuantity()}
        <div className="row align-items-baseline">
          <div className="col-6">
            {this.renderTotalAmount()}
          </div>
          <div className="col-6 mb-2">
            <button
              className="w-100 btn btn-primary"
              disabled={!this.isDataComplete() || this.state.submitting}
              onClick={this.addToCartClicked}
            >
              {
                this.state.submitting ?
                (<LoadingIndicator />) :
                (<i className="fa fa-shopping-cart" />)
              }
              {' '}
              Add to cart
            </button>
          </div>
        </div>
        <ErrorDisplay graphQLError={this.state.error} />
      </div>
    </div>
  )
}

export default ProductOrderForm;
