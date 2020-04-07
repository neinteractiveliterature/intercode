import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';

import { useMutation } from '@apollo/react-hooks';
import { AdminProductsQuery } from '../queries.gql';
import AdminProductVariantsTable from '../AdminProductVariantsTable';
import { CreateProduct, UpdateProduct } from '../mutations.gql';
import ErrorDisplay from '../../ErrorDisplay';
import LiquidInput from '../../BuiltInFormControls/LiquidInput';
import MultipleChoiceInput from '../../BuiltInFormControls/MultipleChoiceInput';
import { mutator, Transforms } from '../../ComposableFormUtils';
import useAsyncFunction from '../../useAsyncFunction';
import useUniqueId from '../../useUniqueId';
import PricingStructureInput from '../PricingStructureInput';
import buildProductInput from '../buildProductInput';
import BooleanInput from '../../BuiltInFormControls/BooleanInput';
import BootstrapFormSelect from '../../BuiltInFormControls/BootstrapFormSelect';
import AppRootContext from '../../AppRootContext';

function duplicateProductForEditing(product) {
  return {
    ...product,
    product_variants: product.product_variants.map((variant) => ({ ...variant })),
    delete_variant_ids: [],
  };
}

function EditAdminProductCard({ initialProduct, close, ticketTypes }) {
  const { ticketName } = useContext(AppRootContext);
  const [createProduct] = useMutation(CreateProduct);
  const [updateProduct] = useMutation(UpdateProduct);
  const [product, setProduct] = useState(
    () => duplicateProductForEditing(initialProduct),
  );
  const editingProductMutator = mutator({
    getState: () => product,
    setState: setProduct,
    transforms: {
      available: Transforms.identity,
      description: Transforms.identity,
      name: Transforms.identity,
      payment_options: Transforms.identity,
      pricing_structure: Transforms.identity,
      product_variants: Transforms.identity,
    },
  });

  const imageChanged = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    setProduct((prevEditingProduct) => ({
      ...prevEditingProduct,
      image: file,
    }));

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setProduct((prevEditingProduct) => ({
        ...prevEditingProduct, image_url: reader.result,
      }));
    });
    reader.readAsDataURL(file);
  };

  const deleteVariant = (variantId) => {
    setProduct((prevEditingProduct) => ({
      ...prevEditingProduct,
      delete_variant_ids: [
        ...prevEditingProduct.delete_variant_ids,
        variantId,
      ],
    }));
  };

  const saveProduct = async () => {
    const productInput = buildProductInput(product);

    if (product.id) {
      await updateProduct({
        variables: { id: product.id, product: productInput },
      });
    } else {
      await createProduct({
        variables: { product: productInput },
        update: (cache, { data: { createProduct: { product: newProduct } } }) => {
          const data = cache.readQuery({ query: AdminProductsQuery });
          data.convention.products.push(newProduct);
          cache.writeQuery({ query: AdminProductsQuery, data });
        },
      });
    }

    close();
  };

  const [saveClicked, saveError] = useAsyncFunction(saveProduct);

  const paymentOptionChoices = [
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
  ];

  const imageInputId = useUniqueId('image-input-');

  return (
    <div className="mb-4 card bg-light border-dark glow-dark">
      <div className="card-header">
        <div className="row align-items-center">
          <div className="col">
            <input
              aria-label="Product name"
              type="text"
              className="form-control"
              placeholder="Product name"
              name="name"
              value={product.name}
              onChange={(event) => { editingProductMutator.name(event.target.value); }}
            />
          </div>
          <div className="mr-2">
            <ul className="list-inline m-0">
              <li className="list-inline-item">
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  onClick={close}
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
          </div>
        </div>
        <div className="d-flex flex-wrap">
          <div className="mr-4">
            <BooleanInput
              name="available"
              caption="Available for purchase"
              value={product.available}
              onChange={editingProductMutator.available}
            />
          </div>
          <div className="mr-4">
            <MultipleChoiceInput
              name="payment_options"
              caption="Payment options"
              choices={paymentOptionChoices}
              multiple
              value={product.payment_options}
              onChange={editingProductMutator.payment_options}
              choiceClassName="form-check-inline"
            />
          </div>
          <div>
            <BootstrapFormSelect
              label={`Provide ${ticketName} type`}
              value={product.provides_ticket_type?.id}
              onValueChange={(value) => setProduct((prev) => ({
                ...prev,
                provides_ticket_type: ticketTypes.find((tt) => tt.id.toString() === value),
              }))}
            >
              <option value={null}>
                No
                {' '}
                {ticketName}
              </option>
              {ticketTypes.map((ticketType) => (
                <option value={ticketType.id} key={ticketType.id}>
                  {ticketType.description}
                </option>
              ))}
            </BootstrapFormSelect>
          </div>
        </div>
      </div>

      <div className="card-body">
        <ErrorDisplay graphQLError={saveError} />

        <div className="d-lg-flex justify-content-lg-start align-items-lg-start">
          <div className="d-flex flex-column align-items-center">
            {product.image_url && (
              <img
                src={product.image_url}
                style={{ maxWidth: '200px' }}
                alt={product.name}
              />
            )}
            <div className="custom-file mt-2" style={{ width: '220px' }}>
              <label className="custom-file-label" htmlFor={imageInputId}>Choose image...</label>
              <input
                id={imageInputId}
                className="custom-file-input"
                type="file"
                accept="image/*"
                onChange={imageChanged}
                aria-label="Choose image..."
              />
            </div>
          </div>

          <div className="ml-lg-4 col-lg">
            <div className="d-flex">
              <strong className="mr-1">Base price:</strong>
              <PricingStructureInput
                value={product.pricing_structure}
                onChange={editingProductMutator.pricing_structure}
              />
            </div>

            <LiquidInput
              value={product.description}
              onChange={editingProductMutator.description}
            />

            <AdminProductVariantsTable
              product={product}
              editing
              onChange={editingProductMutator.product_variants}
              deleteVariant={deleteVariant}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

EditAdminProductCard.propTypes = {
  initialProduct: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    description_html: PropTypes.string.isRequired,
    image_url: PropTypes.string,
    payment_options: PropTypes.arrayOf(PropTypes.string).isRequired,
    pricing_structure: PropTypes.shape({}),
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
  close: PropTypes.func.isRequired,
  ticketTypes: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
  })).isRequired,
};

export default EditAdminProductCard;
