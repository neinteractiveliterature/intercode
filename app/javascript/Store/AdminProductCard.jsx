import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { humanize } from 'inflected';

import { useMutation } from 'react-apollo-hooks';
import { AdminProductsQuery } from './queries.gql';
import AdminProductVariantsTable from './AdminProductVariantsTable';
import BootstrapFormCheckbox from '../BuiltInFormControls/BootstrapFormCheckbox';
import { CreateProduct, DeleteProduct, UpdateProduct } from './mutations.gql';
import ErrorDisplay from '../ErrorDisplay';
import formatMoney from '../formatMoney';
import InPlaceEditor from '../BuiltInFormControls/InPlaceEditor';
import LiquidInput from '../BuiltInFormControls/LiquidInput';
import MultipleChoiceInput from '../BuiltInFormControls/MultipleChoiceInput';
import sortProductVariants from './sortProductVariants';
import { mutator, parseMoneyOrNull, Transforms } from '../ComposableFormUtils';
import { useConfirm } from '../ModalDialogs/Confirm';
import useAsyncFunction from '../useAsyncFunction';
import useUniqueId from '../useUniqueId';

function duplicateProductForEditing(product) {
  return {
    ...product,
    product_variants: product.product_variants.map((variant) => ({ ...variant })),
    delete_variant_ids: [],
  };
}

function AdminProductCard({
  currentAbility, initialEditing, product, onCancelNewProduct, onSaveNewProduct,
}) {
  const confirm = useConfirm();
  const [createProduct] = useMutation(CreateProduct);
  const [updateProduct] = useMutation(UpdateProduct);
  const [deleteProduct] = useMutation(DeleteProduct);
  const [editing, setEditing] = useState(initialEditing);
  const [editingProduct, setEditingProduct] = useState(() => {
    if (initialEditing) {
      return duplicateProductForEditing(product);
    }

    return null;
  });
  const editingProductMutator = mutator({
    getState: () => editingProduct,
    setState: setEditingProduct,
    transforms: {
      available: Transforms.identity,
      description: Transforms.identity,
      name: Transforms.identity,
      payment_options: Transforms.identity,
      price: parseMoneyOrNull,
      product_variants: Transforms.identity,
    },
  });

  const cardClass = classNames('bg-light', {
    'border-dark': editing,
    'glow-dark': editing,
  });

  const editClicked = () => {
    setEditing(true);
    setEditingProduct(duplicateProductForEditing(product));
  };

  const cancelClicked = () => {
    if (product.id) {
      setEditing(false);
      setEditingProduct(null);
    } else {
      onCancelNewProduct(product);
    }
  };

  const imageChanged = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    setEditingProduct((prevEditingProduct) => ({
      ...prevEditingProduct,
      image: file,
    }));

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setEditingProduct((prevEditingProduct) => ({
        ...prevEditingProduct, image_url: reader.result,
      }));
    });
    reader.readAsDataURL(file);
  };

  const deleteVariant = (variantId) => {
    setEditingProduct((prevEditingProduct) => ({
      ...prevEditingProduct,
      delete_variant_ids: [
        ...prevEditingProduct.delete_variant_ids,
        variantId,
      ],
    }));
  };

  const saveProduct = async () => {
    const imageInput = editingProduct.image ? { image: editingProduct.image } : {};
    const productInput = {
      name: editingProduct.name,
      available: editingProduct.available,
      description: editingProduct.description,
      payment_options: editingProduct.payment_options,
      price: {
        fractional: editingProduct.price.fractional,
        currency_code: editingProduct.price.currency_code,
      },
      product_variants: sortProductVariants(editingProduct.product_variants).map((variant) => ({
        id: variant.id,
        name: variant.name,
        description: variant.description,
        override_price: (
          variant.override_price
            ? {
              fractional: variant.override_price.fractional,
              currency_code: variant.override_price.currency_code,
            }
            : null
        ),
      })),
      delete_variant_ids: editingProduct.delete_variant_ids,
      ...imageInput,
    };

    if (editingProduct.id) {
      await updateProduct({
        variables: { id: editingProduct.id, product: productInput },
      });

      setEditing(false);
      setEditingProduct(null);
    } else {
      await createProduct({
        variables: { product: productInput },
        update: (cache, { data: { createProduct: { product: newProduct } } }) => {
          const data = cache.readQuery({ query: AdminProductsQuery });
          data.convention.products.push(newProduct);
          cache.writeQuery({ query: AdminProductsQuery, data });
        },
      });

      onSaveNewProduct(editingProduct);
    }
  };

  const [saveClicked, saveError] = useAsyncFunction(saveProduct);

  const deleteClicked = () => {
    confirm({
      prompt: `Are you sure you want to delete the product ${product.name}?`,
      action: () => deleteProduct({
        variables: { id: product.id },
        update: (cache) => {
          const data = cache.readQuery({ query: AdminProductsQuery });
          data.convention.products = data.convention.products
            .filter((p) => p.id !== product.id);
          cache.writeQuery({ query: AdminProductsQuery, data });
        },
      }),
      renderError: (error) => <ErrorDisplay graphQLError={error} />,
    });
  };

  const renderVariantsTable = () => (
    <AdminProductVariantsTable
      product={editing ? editingProduct : product}
      editing={editing}
      onChange={editingProductMutator.product_variants}
      deleteVariant={deleteVariant}
    />
  );

  const renderActions = () => {
    if (!currentAbility.can_update_products) {
      return null;
    }

    if (editing) {
      return (
        <ul className="list-inline m-0">
          <li className="list-inline-item">
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={cancelClicked}
            >
              Cancel
            </button>
          </li>
          <li className="list-inline-item">
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={saveClicked}
            >
              Save
            </button>
          </li>
        </ul>
      );
    }

    return (
      <ul className="list-inline m-0">
        {product.id != null && (
          <li className="list-inline-item">
            <button
              type="button"
              className="btn btn-sm btn-danger"
              onClick={deleteClicked}
            >
              <i className="fa fa-trash-o">
                <span className="sr-only">Delete product</span>
              </i>
            </button>
          </li>
        )}
        <li className="list-inline-item">
          <button
            type="button"
            className="btn btn-sm btn-secondary"
            onClick={editClicked}
          >
            Edit
          </button>
        </li>
      </ul>
    );
  };

  const renderAvailableForPurchase = () => {
    if (editing) {
      return (
        <div>
          <BootstrapFormCheckbox
            name="available"
            label="Available for purchase"
            checked={editingProduct.available}
            onCheckedChange={editingProductMutator.available}
          />
          <MultipleChoiceInput
            name="payment_options"
            caption="Payment options"
            choices={[
              {
                label: (
                  <span>
                    <i className="fa fa-cc-stripe" />
                    {' '}
                    Stripe
                  </span>
                ),
                value: 'stripe',
              },
              {
                label: (
                  <span>
                    <i className="fa fa-suitcase" />
                    {' '}
                    Pay at convention
                  </span>
                ),
                value: 'pay_at_convention',
              },
            ]}
            multiple
            value={editingProduct.payment_options}
            onChange={editingProductMutator.payment_options}
          />
        </div>
      );
    }

    return (
      <div>
        <span
          className={classNames('badge', product.available ? 'badge-success' : 'badge-danger')}
        >
          {product.available
            ? 'Available for purchase'
            : 'Not available for purchase'}
        </span>
        {product.payment_options.map((paymentOption) => (
          <i
            key={paymentOption}
            className={
              classNames(
                'ml-2',
                'fa',
                {
                  'fa-cc-stripe': paymentOption === 'stripe',
                  'fa-suitcase': paymentOption === 'pay_at_convention',
                },
              )
            }
            title={humanize(paymentOption)}
          />
        ))}
      </div>
    );
  };

  const renderImage = (url) => {
    if (!url) {
      return null;
    }

    return (
      <img
        src={url}
        style={{ maxWidth: '200px' }}
        alt={product.name}
      />
    );
  };

  const imageInputId = useUniqueId('image-input-');

  const renderImageSection = () => {
    if (editing) {
      return (
        <div className="d-flex flex-column align-items-center">
          {renderImage(editingProduct.image_url)}
          <div className="custom-file mt-2" style={{ width: '220px' }}>
            <label className="custom-file-label" htmlFor={imageInputId}>Choose image...</label>
            <input
              id={imageInputId}
              className="custom-file-input"
              type="file"
              accept="image/*"
              onChange={imageChanged}
            />
          </div>
        </div>
      );
    }

    return renderImage(product.image_url);
  };

  const renderName = () => {
    if (editing) {
      return (
        <input
          aria-label="Product name"
          type="text"
          className="form-control"
          placeholder="Product name"
          name="name"
          value={editingProduct.name}
          onChange={(event) => { editingProductMutator.name(event.target.value); }}
        />
      );
    }

    return (
      <div className="lead">{product.name}</div>
    );
  };

  const renderPrice = () => {
    if (editing) {
      return (
        <div className="d-flex">
          <strong className="mr-1">Base price:</strong>
          <InPlaceEditor
            name="price"
            label="Base price"
            value={`${formatMoney(editingProduct.price, false)}`}
            onChange={editingProductMutator.price}
          >
            {formatMoney(editingProduct.price)}
          </InPlaceEditor>
        </div>
      );
    }

    return (
      <p>
        <strong>
          Base price:
          {formatMoney(product.price)}
        </strong>
      </p>
    );
  };

  const renderDescription = () => {
    if (editing) {
      return (
        <LiquidInput
          value={editingProduct.description}
          onChange={editingProductMutator.description}
        />
      );
    }

    return (
      // eslint-disable-next-line react/no-danger
      <div dangerouslySetInnerHTML={{ __html: product.description_html }} />
    );
  };

  return (
    <div className={classNames('mb-4 card', cardClass)}>
      <div className="card-header">
        <div className="row align-items-center">
          <div className="col">
            {renderName()}
          </div>
          <div className="mr-2">
            {renderActions()}
          </div>
        </div>
        {renderAvailableForPurchase()}
      </div>

      <div className="card-body">
        <ErrorDisplay graphQLError={saveError} />

        <div className="d-lg-flex justify-content-lg-start align-items-lg-start">
          {renderImageSection()}

          <div className="ml-lg-4 col-lg">
            {renderPrice()}
            {renderDescription()}
            {renderVariantsTable()}
          </div>
        </div>
      </div>
    </div>
  );
}

AdminProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    description_html: PropTypes.string.isRequired,
    image_url: PropTypes.string,
    payment_options: PropTypes.arrayOf(PropTypes.string).isRequired,
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
  currentAbility: PropTypes.shape({
    can_update_products: PropTypes.bool.isRequired,
  }).isRequired,
  initialEditing: PropTypes.bool,
  onCancelNewProduct: PropTypes.func.isRequired,
  onSaveNewProduct: PropTypes.func.isRequired,
};

AdminProductCard.defaultProps = {
  initialEditing: false,
};

export default AdminProductCard;
