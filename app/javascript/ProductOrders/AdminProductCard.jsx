import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import classNames from 'classnames';
import { adminProductFragment, productsQuery } from './queries';
import BootstrapFormCheckbox from '../BuiltInFormControls/BootstrapFormCheckbox';
import ErrorDisplay from '../ErrorDisplay';
import formatMoney from '../formatMoney';
import InPlaceEditor from '../BuiltInFormControls/InPlaceEditor';
import LiquidInput from '../BuiltInFormControls/LiquidInput';
import sortProductVariants from './sortProductVariants';
import {
  Transforms,
  composeStateChangeCalculators,
  componentStateFieldUpdater,
  stateUpdater,
} from '../ComposableFormUtils';

const parseMoneyOrNull = (value) => {
  const newPrice = Transforms.float(value);

  if (newPrice == null) {
    return null;
  }

  return {
    fractional: Math.floor(newPrice * 100),
    currency_code: 'USD',
  };
};

const variantMatches = (a, b) => (
  (a.generatedId && b.generatedId === a.generatedId) ||
  (a.id && b.id === a.id)
);

const productVariantUpdaterForComponent = (component, variant, stateChangeCalculators) => (
  stateUpdater(
    () => component.state.editingProduct.product_variants
      .find(existingVariant => variantMatches(variant, existingVariant)),

    (state) => {
      const newVariants = component.state.editingProduct.product_variants.map((existingVariant) => {
        if (variantMatches(variant, existingVariant)) {
          return { ...existingVariant, ...state };
        }

        return existingVariant;
      });

      component.setState({
        editingProduct: {
          ...component.state.editingProduct,
          product_variants: newVariants,
        },
      });
    },

    stateChangeCalculators,
  )
);

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

  addVariantClicked = () => {
    const position = Math.max(0, ...this.state.editingProduct.product_variants
      .map(variant => variant.position)) + 1;

    this.setState({
      editingProduct: {
        ...this.state.editingProduct,
        product_variants: [
          ...this.state.editingProduct.product_variants,
          {
            generatedId: new Date().getTime(),
            name: null,
            description: null,
            override_price: null,
            position,
          },
        ],
      },
    });
  }

  deleteVariantClicked = (variant) => {
    if (variant.id) {
      this.setState({
        editingProduct: {
          ...this.state.editingProduct,
          delete_variant_ids: [
            ...this.state.editingProduct.delete_variant_ids,
            variant.id,
          ],
        },
      });
    } else if (variant.generatedId) {
      this.setState({
        editingProduct: {
          ...this.state.editingProduct,
          product_variants: this.state.editingProduct.product_variants
            .filter(existingVariant => existingVariant.generatedId !== variant.generatedId),
        },
      });
    }
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
      product_variants: editingProduct.product_variants.map(variant => ({
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

  renderVariantsTable = () => {
    const addVariantButton = (
      this.state.editing ?
        (
          <button className="btn btn-primary btn-sm" onClick={this.addVariantClicked}>
            Add variant
          </button>
        ) :
        null
    );

    if (this.props.product.product_variants.length === 0) {
      return (
        <div>
          <p>This product does not have any variants.</p>
          {addVariantButton}
        </div>
      );
    }

    let variants;
    if (this.state.editing) {
      variants = this.state.editingProduct.product_variants
        .filter(variant => !this.state.editingProduct.delete_variant_ids.includes(variant.id));
    } else {
      variants = this.props.product.product_variants;
    }

    const rows = sortProductVariants(variants).map((variant) => {
      if (this.state.editing) {
        const variantUpdater = productVariantUpdaterForComponent(
          this,
          variant,
          composeStateChangeCalculators({
            name: Transforms.identity,
            description: Transforms.identity,
            override_price: parseMoneyOrNull,
          }),
        );

        return (
          <tr key={variant.id || variant.generatedId}>
            <td>
              <InPlaceEditor
                value={variant.name}
                onChange={variantUpdater.name || ''}
              />
            </td>
            <td>
              <InPlaceEditor
                className="d-flex align-items-start"
                value={variant.description || ''}
                onChange={variantUpdater.description}
                renderInput={({ value, onChange }) => (
                  <LiquidInput value={value} onChange={onChange} className="col" />
                )}
              />
            </td>
            <td>
              <InPlaceEditor
                value={variant.override_price ? `${formatMoney(variant.override_price, false)}` : ''}
                onChange={variantUpdater.override_price}
              >
                {variant.override_price ? formatMoney(variant.override_price) : null}
              </InPlaceEditor>
            </td>
            <td>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => { this.deleteVariantClicked(variant); }}
              >
                <i className="fa fa-trash-o">
                  <span className="sr-only">Delete {variant.name}</span>
                </i>
              </button>
            </td>
          </tr>
        );
      }

      return (
        <tr key={variant.id}>
          <td>{variant.name}</td>
          <td>{variant.description}</td>
          <td>{variant.override_price ? formatMoney(variant.override_price) : null}</td>
          <td />
        </tr>
      );
    });

    return (
      <div className="mt-2">
        <table className="table table-sm">
          <thead>
            <tr>
              <th>Variant name</th>
              <th>Description</th>
              <th>Override price</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
        {addVariantButton}
      </div>
    );
  }

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
