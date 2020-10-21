import React, { useState, useContext } from 'react';
import { ApolloError } from '@apollo/client';

import { AdminProductsQuery } from '../queries';
import AdminProductVariantsTable from './AdminProductVariantsTable';
import ErrorDisplay from '../../ErrorDisplay';
import LiquidInput from '../../BuiltInFormControls/LiquidInput';
import MultipleChoiceInput from '../../BuiltInFormControls/MultipleChoiceInput';
import useAsyncFunction from '../../useAsyncFunction';
import useUniqueId from '../../useUniqueId';
import PricingStructureInput from './PricingStructureInput';
import buildProductInput from '../buildProductInput';
import BooleanInput from '../../BuiltInFormControls/BooleanInput';
import BootstrapFormSelect from '../../BuiltInFormControls/BootstrapFormSelect';
import AppRootContext from '../../AppRootContext';
import { AdminProductsQueryQuery } from '../queries.generated';
import { useCreateProductMutation, useUpdateProductMutation } from '../mutations.generated';
import { usePartialState, usePartialStateFactory } from '../../usePartialState';
import { EditingProduct } from './EditingProductTypes';
import { hasRealId } from '../../GeneratedIdUtils';

export type EditAdminProductCardProps = {
  initialProduct: EditingProduct;
  close: () => void;
  ticketTypes: AdminProductsQueryQuery['convention']['ticket_types'];
};

function EditAdminProductCard({ initialProduct, close, ticketTypes }: EditAdminProductCardProps) {
  const { ticketName } = useContext(AppRootContext);
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [product, setProduct] = useState(initialProduct);
  const factory = usePartialStateFactory(product, setProduct);
  const [available, setAvailable] = usePartialState(factory, 'available');
  const [description, setDescription] = usePartialState(factory, 'description');
  const [name, setName] = usePartialState(factory, 'name');
  const [paymentOptions, setPaymentOptions] = usePartialState(factory, 'payment_options');
  const [pricingStructure, setPricingStructure] = usePartialState(factory, 'pricing_structure');
  const [, setProductVariants] = usePartialState(factory, 'product_variants');

  const imageChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0];
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
        ...prevEditingProduct,
        image_url: reader.result?.toString(),
      }));
    });
    reader.readAsDataURL(file);
  };

  const deleteVariant = (variantId: number) => {
    setProduct((prevEditingProduct) => ({
      ...prevEditingProduct,
      delete_variant_ids: [...prevEditingProduct.delete_variant_ids, variantId],
    }));
  };

  const saveProduct = async () => {
    const productInput = buildProductInput(product);

    if (hasRealId(product)) {
      await updateProduct({
        variables: { id: product.id, product: productInput },
      });
    } else {
      await createProduct({
        variables: { product: productInput },
        update: (cache, result) => {
          const data = cache.readQuery<AdminProductsQueryQuery>({ query: AdminProductsQuery });
          const newProduct = result.data?.createProduct?.product;
          if (!data || !newProduct) {
            return;
          }
          cache.writeQuery<AdminProductsQueryQuery>({
            query: AdminProductsQuery,
            data: {
              ...data,
              convention: {
                ...data.convention,
                products: [...data.convention.products, newProduct],
              },
            },
          });
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
          <i className="fa fa-cc-stripe" /> Stripe
        </span>
      ),
      value: 'stripe',
    },
    {
      label: (
        <span>
          <i className="fa fa-suitcase" /> Pay at convention
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
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div className="mr-2">
            <ul className="list-inline m-0">
              <li className="list-inline-item">
                <button type="button" className="btn btn-sm btn-secondary" onClick={close}>
                  Cancel
                </button>
              </li>
              <li className="list-inline-item">
                <button type="button" className="btn btn-sm btn-primary" onClick={saveClicked}>
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
              value={available}
              onChange={setAvailable}
            />
          </div>
          <div className="mr-4">
            <MultipleChoiceInput
              name="payment_options"
              caption="Payment options"
              choices={paymentOptionChoices}
              multiple
              value={paymentOptions}
              onChange={(newValue: string[]) => setPaymentOptions(newValue)}
              choiceClassName="form-check-inline"
            />
          </div>
          <div>
            <BootstrapFormSelect
              label={`Provide ${ticketName} type`}
              value={product.provides_ticket_type?.id}
              onValueChange={(value) =>
                setProduct((prev) => ({
                  ...prev,
                  provides_ticket_type: ticketTypes.find((tt) => tt.id.toString() === value),
                }))
              }
            >
              <option value={undefined}>No {ticketName}</option>
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
        <ErrorDisplay graphQLError={saveError as ApolloError} />

        <div className="d-lg-flex justify-content-lg-start align-items-lg-start">
          <div className="d-flex flex-column align-items-center">
            {product.image_url && (
              <img src={product.image_url} style={{ maxWidth: '200px' }} alt={product.name} />
            )}
            <div className="custom-file mt-2" style={{ width: '220px' }}>
              <label className="custom-file-label" htmlFor={imageInputId}>
                Choose image...
              </label>
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
              <PricingStructureInput value={pricingStructure} onChange={setPricingStructure} />
            </div>

            <LiquidInput value={description ?? ''} onChange={setDescription} />

            <AdminProductVariantsTable
              product={product}
              editing
              onChange={setProductVariants}
              deleteVariant={deleteVariant}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditAdminProductCard;
