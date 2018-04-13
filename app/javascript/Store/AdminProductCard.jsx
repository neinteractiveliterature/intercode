import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import classNames from 'classnames';
import { ConfirmModal } from 'react-bootstrap4-modal';
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
  combineStateChangeCalculators,
  componentLocalStateUpdater,
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

const deleteProductMutation = gql`
mutation($id: Int!) {
  deleteProduct(input: { id: $id }) {
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
      id: PropTypes.number,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      image_url: PropTypes.string,
      price: PropTypes.shape({
        fractional: PropTypes.number.isRequired,
        currency_code: PropTypes.string.isRequired,
      }),
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
    onCancelNewProduct: PropTypes.func.isRequired,
    onSaveNewProduct: PropTypes.func.isRequired,
  }

  static defaultProps = {
    initialEditing: false,
  };

  constructor(props) {
    super(props);

    this.state = (
      props.initialEditing ?
        this.getEditState() :
        {
          editing: props.initialEditing,
          editingProduct: null,
        }
    );

    this.stateUpdater = componentLocalStateUpdater(
      this,
      combineStateChangeCalculators({
        editingProduct: {
          available: Transforms.checkboxChange,
          description: Transforms.identity,
          name: Transforms.textInputChange,
          price: parseMoneyOrNull,
          product_variants: Transforms.identity,
        },
      }),
    );
  }

  getCardClass = () => (
    classNames('bg-light', {
      'border-dark': this.state.editing,
      'glow-dark': this.state.editing,
    })
  )

  getEditState = () => ({
    error: null,
    editing: true,
    editingProduct: {
      ...this.props.product,
      product_variants: this.props.product.product_variants.map(variant => ({ ...variant })),
      delete_variant_ids: [],
    },
  });

  editClicked = () => {
    this.setState(this.getEditState());
  }

  cancelClicked = () => {
    if (this.props.product.id) {
      this.setState({ editing: false, editingProduct: null, error: null });
    } else {
      this.props.onCancelNewProduct(this.props.product);
    }
  }

  imageChanged = (event) => {
    const file = event.target.files[0];
    this.setState({
      editingProduct: {
        ...this.state.editingProduct,
        image: file,
      },
    });

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.setState({
        editingProduct: {
          ...this.state.editingProduct,
          image_url: reader.result,
        },
      });
    });
    reader.readAsDataURL(file);
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

  beginConfirm = (prompt, action) => {
    this.setState({
      confirm: { prompt, action },
    });
  }

  performConfirm = async () => {
    await this.state.confirm.action();
    this.setState({ confirm: null });
  }

  cancelConfirm = () => {
    this.setState({ confirm: null });
  }

  saveClicked = async (createProduct, updateProduct) => {
    const { editingProduct } = this.state;
    const imageInput = editingProduct.image ? { image: editingProduct.image } : {};
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
      ...imageInput,
    };

    this.setState({ error: null });

    try {
      if (this.state.editingProduct.id) {
        await updateProduct({
          variables: { id: this.state.editingProduct.id, product: productInput },
        });

        this.setState({ editing: false, editingProduct: null });
      } else {
        await createProduct({
          variables: { product: productInput },
          update: (cache, { data: { createProduct: { product } } }) => {
            const data = cache.readQuery({ query: productsQuery });
            data.convention.products.push(product);
            cache.writeQuery({ query: productsQuery, data });
          },
        });

        this.props.onSaveNewProduct(this.state.editingProduct);
      }
    } catch (error) {
      this.setState({ error });
    }
  }

  deleteClicked = (deleteProduct) => {
    this.beginConfirm(
      `Are you sure you want to delete the product ${this.props.product.name}?`,
      async () => {
        try {
          await deleteProduct({
            variables: { id: this.props.product.id },
            update: (cache) => {
              const data = cache.readQuery({ query: productsQuery });
              data.convention.products = data.convention.products
                .filter(product => product.id !== this.props.product.id);
              cache.writeQuery({ query: productsQuery, data });
            },
          });
        } catch (error) {
          this.setState({ error });
        }
      },
    );
  }

  renderVariantsTable = () => (
    <AdminProductVariantsTable
      product={this.state.editing ? this.state.editingProduct : this.props.product}
      editing={this.state.editing}
      onChange={this.stateUpdater.editingProduct.product_variants}
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

    let deleteButton = null;
    if (this.props.product.id != null) {
      deleteButton = (
        <li className="list-inline-item">
          <Mutation mutation={deleteProductMutation}>
            {deleteProduct => (
              <button
                className="btn btn-sm btn-danger"
                onClick={() => { this.deleteClicked(deleteProduct); }}
              >
                <i className="fa fa-trash-o">
                  <span className="sr-only">Delete product</span>
                </i>
              </button>
            )}
          </Mutation>
        </li>
      );
    }

    return (
      <ul className="list-inline m-0">
        {deleteButton}
        <li className="list-inline-item">
          <button className="btn btn-sm btn-secondary" onClick={this.editClicked}>Edit</button>
        </li>
      </ul>
    );
  }

  renderAvailableForPurchase = () => {
    if (this.state.editing) {
      return (
        <BootstrapFormCheckbox
          name="available"
          label="Available for purchase"
          checked={this.state.editingProduct.available}
          onChange={this.stateUpdater.editingProduct.available}
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

  renderImage = (url) => {
    if (!url) {
      return null;
    }

    return (
      <img
        src={url}
        style={{ maxWidth: '200px' }}
        alt={this.props.product.name}
      />
    );
  }

  renderImageSection = () => {
    if (this.state.editing) {
      return (
        <div className="d-flex flex-column align-items-center">
          {this.renderImage(this.state.editingProduct.image_url)}
          <div className="custom-file mt-2" style={{ width: '220px' }}>
            <label className="custom-file-label">Choose image...</label>
            <input
              className="custom-file-input"
              type="file"
              accept="image/*"
              onChange={this.imageChanged}
            />
          </div>
        </div>
      );
    }

    return this.renderImage(this.props.product.image_url);
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
          onChange={this.stateUpdater.editingProduct.name}
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
            onChange={this.stateUpdater.editingProduct.price}
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
          onChange={this.stateUpdater.editingProduct.description}
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

        <div className="d-lg-flex justify-content-lg-start align-items-lg-start">
          {this.renderImageSection()}

          <div className="ml-lg-4 col-lg">
            {this.renderPrice()}
            {this.renderDescription()}
            {this.renderVariantsTable()}
          </div>
        </div>

        <ConfirmModal
          visible={this.state.confirm != null}
          onOK={this.performConfirm}
          onCancel={this.cancelConfirm}
        >
          {(this.state.confirm || {}).prompt}
        </ConfirmModal>
      </div>
    </div>
  )
}

export default AdminProductCard;
