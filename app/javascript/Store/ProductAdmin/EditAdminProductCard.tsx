import { useState, useContext } from 'react';
import * as React from 'react';
import { ApolloError } from '@apollo/client';
import {
  ErrorDisplay,
  MultipleChoiceInput,
  useUniqueId,
  BooleanInput,
  BootstrapFormSelect,
  usePropertySetters,
} from '@neinteractiveliterature/litform';

import { AdminProductsQuery } from '../queries';
import AdminProductVariantsTable from './AdminProductVariantsTable';
import LiquidInput from '../../BuiltInFormControls/LiquidInput';
import useAsyncFunction from '../../useAsyncFunction';
import PricingStructureInput from './PricingStructureInput';
import buildProductInput from '../buildProductInput';
import AppRootContext from '../../AppRootContext';
import { AdminProductsQueryData } from '../queries.generated';
import { useCreateProductMutation, useUpdateProductMutation } from '../mutations.generated';
import { EditingProduct } from './EditingProductTypes';
import { hasRealId } from '../../GeneratedIdUtils';
import { PricingStrategy } from '../../graphqlTypes.generated';

export type EditAdminProductCardProps = {
  initialProduct: EditingProduct;
  close: () => void;
  ticketTypes: AdminProductsQueryData['convention']['ticket_types'];
};

function EditAdminProductCard({ initialProduct, close, ticketTypes }: EditAdminProductCardProps): JSX.Element {
  const { ticketName } = useContext(AppRootContext);
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [product, setProduct] = useState(initialProduct);
  const [setAvailable, setDescription, setName, setPaymentOptions, setPricingStructure, setProductVariants] =
    usePropertySetters(
      setProduct,
      'available',
      'description',
      'name',
      'payment_options',
      'pricing_structure',
      'product_variants',
    );

  const imageChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = (event.target.files ?? [])[0];
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

  const deleteVariant = (variantId: string) => {
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
          const data = cache.readQuery<AdminProductsQueryData>({ query: AdminProductsQuery });
          const newProduct = result.data?.createProduct?.product;
          if (!data || !newProduct) {
            return;
          }
          cache.writeQuery<AdminProductsQueryData>({
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
          <i className="bi-credit-card" /> Stripe
        </span>
      ),
      value: 'stripe',
    },
    {
      label: (
        <span>
          <i className="bi-briefcase-fill" /> Pay at convention
        </span>
      ),
      value: 'pay_at_convention',
    },
  ];

  const imageInputId = useUniqueId('image-input-');

  return (
    <div className="mb-4 card bg-light border-dark glow-dark">
      <div className="card-header">
        <div className="d-flex align-items-center">
          <div className="flex-grow-1">
            <input
              aria-label="Product name"
              type="text"
              className="form-control"
              placeholder="Product name"
              name="name"
              value={product.name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div className="ms-2">
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
          <div className="me-4">
            <BooleanInput
              name="available"
              caption="Available for purchase"
              value={product.available}
              onChange={setAvailable}
            />
          </div>
          <div className="me-4">
            <MultipleChoiceInput
              name="payment_options"
              caption="Payment options"
              choices={paymentOptionChoices}
              multiple
              value={product.payment_options}
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
            {product.image_url && <img src={product.image_url} style={{ maxWidth: '200px' }} alt={product.name} />}
            <div className="mt-2" style={{ width: '220px' }}>
              <label className="form-label" htmlFor={imageInputId}>
                Choose image...
              </label>
              <input
                id={imageInputId}
                className="form-control"
                type="file"
                accept="image/*"
                onChange={imageChanged}
                aria-label="Choose image..."
              />
            </div>
          </div>

          <div className="ml-lg-4 col-lg">
            <div className="d-flex">
              <strong className="me-1">Base price:</strong>
              <PricingStructureInput
                value={
                  product.pricing_structure ?? {
                    __typename: 'PricingStructure',
                    pricing_strategy: PricingStrategy.Fixed,
                    value: {
                      __typename: 'Money',
                      currency_code: 'USD',
                      fractional: 0,
                    },
                  }
                }
                onChange={setPricingStructure}
              />
            </div>

            <LiquidInput value={product.description ?? ''} onChange={setDescription} />

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
