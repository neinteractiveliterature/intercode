import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import classNames from 'classnames';
import { adminProductFragment, productsQuery } from './queries';
import AdminProductVariantsTable from './AdminProductVariantsTable';
import BootstrapFormCheckbox from '../BuiltInFormControls/BootstrapFormCheckbox';
import ErrorDisplay from '../ErrorDisplay';
import formatMoney from '../formatMoney';
import InPlaceEditor from '../BuiltInFormControls/InPlaceEditor';
import LiquidInput from '../BuiltInFormControls/LiquidInput';
import { parseMoneyOrNull } from '../FormUtils';
import sortProductVariants from './sortProductVariants';
import {
  Transforms,
  composeStateChangeCalculators,
  componentStateFieldUpdater,
} from '../ComposableFormUtils';

const createProductMutation = gql`
mutation($product: ProductInput!) {
  createProduct(input: { product: $product }) {
    product {
      ...AdminProductFields
    }
  }
}

${adminProductFragment}
`;

const updateProductMutation = gql`
mutation($id: Int!, $product: ProductInput!) {
  updateProduct(input: { id: $id, product: $product }) {
    product {
      ...AdminProductFields
    }
  }
}

${adminProductFragment}
`;

class AdminProductCard extends React.Component {
  static propTypes = {
    product: PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      image_url: PropTypes.string,
      price: PropTypes.shape({
        fractional: PropTypes.number.isRequired,
        currency_code: PropTypes.string.isRequired,
      }).isRequired,
      product_variants: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        override_price: PropTypes.shape({
          fractional: PropTypes.number.isRequired,
          currency_code: PropTypes.string.isRequired,
        }),
      }).isRequired).isRequired,
      available: PropTypes.bool.isRequired,
    }).isRequired,
    initialEditing: PropTypes.bool,
  }

  static defaultProps = {
    initialEditing: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      editing: props.initialEditing,
      editingProduct: null,
    };

    this.editingProductUpdater = componentStateFieldUpdater(
      this,
      'editingProduct',
      composeStateChangeCalculators({
        available: Transforms.checkboxChange,
        description: Transforms.identity,
        name: Transforms.textInputChange,
        price: parseMoneyOrNull,
        product_variants: Transforms.identity,
      }),
    );
  }

  getCardClass = () => (
    classNames('bg-light', {
      'border-dark': this.state.editing,
      'glow-dark': this.state.editing,
    })
  )

  editClicked = () => {
    this.setState({
      error: null,
      editing: true,
      editingProduct: {
        ...this.props.product,
        product_variants: this.props.product.product_variants.map(variant => ({ ...variant })),
        delete_variant_ids: [],
      },
    });
  }

  cancelClicked = () => {
    this.setState({ editing: false, editingProduct: null, error: null });
  }

  deleteVariant = (variantId) => {
    this.setState({
      editingProduct: {
        ...this.state.editingProduct,
        delete_variant_ids: [
          ...this.state.editingProduct.delete_variant_ids,
          variantId,
        ],
      },
    });
  }

  saveClicked = async (createProduct, updateProduct) => {
    const { editingProduct } = this.state;
    const productInput = {
      name: editingProduct.name,
      available: editingProduct.available,
      description: editingProduct.description,
      price: {
        fractional: editingProduct.price.fractional,
        currency_code: editingProduct.price.currency_code,
      },
      product_variants: sortProductVariants(editingProduct.product_variants).map(variant => ({
        id: variant.id,
        name: variant.name,
        description: variant.description,
        override_price: (
          variant.override_price ?
            {
              fractional: variant.override_price.fractional,
              currency_code: variant.override_price.currency_code,
            } :
            null
        ),
      })),
      delete_variant_ids: editingProduct.delete_variant_ids,
    };

    this.setState({ error: null });

    try {
      if (this.state.editingProduct.id) {
        await updateProduct({
          variables: { id: this.state.editingProduct.id, product: productInput },
        });
      } else {
        await createProduct({
          variables: { product: productInput },
          update: (cache, { data: { createProduct: { product } } }) => {
            const data = cache.readQuery(productsQuery);
            data.convention.products.push(product);
            cache.writeQuery({ query: productsQuery, data });
          },
        });
      }

      this.setState({ editing: false, editingProduct: null });
    } catch (error) {
      this.setState({ error });
    }
  }

  renderVariantsTable = () => (
    <AdminProductVariantsTable
      product={this.state.editing ? this.state.editingProduct : this.props.product}
      editing={this.state.editing}
      onChange={this.editingProductUpdater.product_variants}
      deleteVariant={this.deleteVariant}
    />
  )

  renderActions = () => {
    if (this.state.editing) {
      return (
        <ul className="list-inline m-0">
          <li className="list-inline-item">
            <button className="btn btn-sm btn-secondary" onClick={this.cancelClicked}>Cancel</button>
          </li>
          <li className="list-inline-item">
            <Mutation mutation={createProductMutation}>
              {createProduct => (
                <Mutation mutation={updateProductMutation}>
                  {updateProduct => (
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => { this.saveClicked(createProduct, updateProduct); }}
                    >
                      Save
                    </button>
                  )}
                </Mutation>
              )}
            </Mutation>
          </li>
        </ul>
      );
    }

    return (
      <button className="btn btn-sm btn-secondary" onClick={this.editClicked}>Edit</button>
    );
  }

  renderAvailableForPurchase = () => {
    if (this.state.editing) {
      return (
        <BootstrapFormCheckbox
          name="available"
          label="Available for purchase"
          checked={this.state.editingProduct.available}
          onChange={this.editingProductUpdater.available}
        />
      );
    }

    return (
      <div
        className={classNames('badge', this.props.product.available ? 'badge-success' : 'badge-danger')}
      >
        {
          this.props.product.available ?
          'Available for purchase' :
          'Not available for purchase'
        }
      </div>
    );
  }

  renderName = () => {
    if (this.state.editing) {
      return (
        <input
          type="text"
          className="form-control"
          placeholder="Product name"
          name="name"
          value={this.state.editingProduct.name}
          onChange={this.editingProductUpdater.name}
        />
      );
    }

    return (
      <div className="lead">{this.props.product.name}</div>
    );
  }

  renderPrice = () => {
    if (this.state.editing) {
      return (
        <div className="d-flex">
          <strong className="mr-1">Base price:</strong>
          <InPlaceEditor
            name="price"
            label="Base price"
            value={`${formatMoney(this.state.editingProduct.price, false)}`}
            onChange={this.editingProductUpdater.price}
          >
            {formatMoney(this.state.editingProduct.price)}
          </InPlaceEditor>
        </div>
      );
    }

    return (
      <p><strong>Base price: {formatMoney(this.props.product.price)}</strong></p>
    );
  }

  renderDescription = () => {
    if (this.state.editing) {
      return (
        <LiquidInput
          value={this.state.editingProduct.description}
          onChange={this.editingProductUpdater.description}
        />
      );
    }

    return (
      <p>{this.props.product.description}</p>
    );
  }

  render = () => (
    <div className={`mb-4 card ${this.getCardClass()}`}>
      <div className="card-header">
        <div className="row align-items-center">
          <div className="col">
            {this.renderName()}
          </div>
          <div className="mr-2">
            {this.renderActions()}
          </div>
        </div>
        {this.renderAvailableForPurchase()}
      </div>

      <div className="card-body">
        <ErrorDisplay graphQLError={this.state.error} />

        <div className="media">
          {
            this.props.product.image_url ?
              (
                <img
                  src={this.props.product.image_url}
                  style={{ maxWidth: '200px' }}
                  alt={this.props.product.name}
                />
              ) :
              null
          }

          <div className="media-body ml-4">
            {this.renderPrice()}
            {this.renderDescription()}
            {this.renderVariantsTable()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminProductCard;
