import { useUniqueId } from '@dnd-kit/utilities';
import {
  usePropertySetters,
  BooleanInput,
  MultipleChoiceInput,
  BootstrapFormSelect,
  BootstrapFormInput,
} from '@neinteractiveliterature/litform';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import AppRootContext from '../../AppRootContext';
import LiquidInput from '../../BuiltInFormControls/LiquidInput';
import { WithRealOrGeneratedId } from '../../GeneratedIdUtils';
import { PricingStrategy } from '../../graphqlTypes.generated';
import AdminProductVariantsTable from './AdminProductVariantsTable';
import { EditingProductBase } from './EditingProductTypes';
import PricingStructureForm from './PricingStructureForm';
import { AdminProductsQueryData } from './queries.generated';

export type EditProductFormProps<ProductType extends WithRealOrGeneratedId<EditingProductBase, string>> = {
  product: ProductType;
  setProduct: React.Dispatch<React.SetStateAction<ProductType>>;
  ticketTypes: AdminProductsQueryData['convention']['ticket_types'];
  lockProvidesTicketType?: boolean;
  hideVariants?: boolean;
};

export default function EditProductForm<ProductType extends WithRealOrGeneratedId<EditingProductBase, string>>({
  product,
  setProduct,
  ticketTypes,
  lockProvidesTicketType,
  hideVariants,
}: EditProductFormProps<ProductType>) {
  const { t } = useTranslation();
  const { ticketName, defaultCurrencyCode } = useContext(AppRootContext);
  const [
    setAvailable,
    setName,
    setPaymentOptions,
    setPricingStructure,
    setDescription,
    setProductVariants,
    setClickwrapAgreement,
  ] = usePropertySetters(
    setProduct,
    'available',
    'name',
    'payment_options',
    'pricing_structure',
    'description',
    'product_variants',
    'clickwrap_agreement',
  );
  const imageChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = (event.target.files ?? [])[0];
    if (!file) {
      return;
    }

    setProduct((prevEditingProduct) => ({
      ...prevEditingProduct,
      imageFile: file,
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
  const imageInputId = useUniqueId('image-input-');

  const deleteVariant = (variantId: string) => {
    setProduct((prevEditingProduct) => ({
      ...prevEditingProduct,
      delete_variant_ids: [...prevEditingProduct.delete_variant_ids, variantId],
    }));
  };

  const paymentOptionChoices = [
    {
      label: (
        <span>
          <>
            <i className="bi-credit-card" /> {t('admin.store.paymentOptions.stripe')}
          </>
        </span>
      ),
      // eslint-disable-next-line i18next/no-literal-string
      value: 'stripe',
    },
    {
      label: (
        <span>
          <>
            <i className="bi-briefcase-fill" /> {t('admin.store.paymentOptions.payAtConvention')}
          </>
        </span>
      ),
      // eslint-disable-next-line i18next/no-literal-string
      value: 'pay_at_convention',
    },
  ];

  return (
    <div className="d-lg-flex justify-content-lg-start align-items-lg-start">
      <div className="d-flex flex-column align-items-center"></div>
      <div className="ml-lg-4 col-lg">
        <BootstrapFormInput label={t('admin.store.products.nameLabel')} value={product.name} onTextChange={setName} />

        <div className="mb-3">
          <BooleanInput
            name="available"
            caption={t('admin.store.products.available')}
            value={product.available}
            onChange={setAvailable}
          />
        </div>
        <div className="mb-3">
          <BootstrapFormSelect
            label={t('admin.store.products.providesTicketTypeLabel', { ticketName })}
            value={product.provides_ticket_type?.id}
            disabled={lockProvidesTicketType}
            onValueChange={(value) =>
              setProduct((prev) => ({
                ...prev,
                provides_ticket_type: ticketTypes.find((tt) => tt.id.toString() === value),
              }))
            }
          >
            <option value={undefined}>{t('admin.store.products.noTicketOption', { ticketName })}</option>
            {ticketTypes.map((ticketType) => (
              <option value={ticketType.id} key={ticketType.id}>
                {ticketType.description}
              </option>
            ))}
          </BootstrapFormSelect>
        </div>

        <section className="mt-4">
          <hr />
          <h3>{t('admin.store.products.productDisplayHeader')}</h3>

          <div className="mb-3">
            <label className="form-label form-item-label">{t('admin.store.products.descriptionLabel')}</label>
            <LiquidInput value={product.description ?? ''} onChange={setDescription} />
          </div>

          {product.image && <img src={product.image.url} style={{ maxWidth: '200px' }} alt={product.name} />}
          <div className="mt-2 mb-3">
            <label className="form-label" htmlFor={imageInputId}>
              {t('buttons.chooseImage')}
            </label>
            <input
              id={imageInputId}
              className="form-control"
              type="file"
              accept="image/*"
              onChange={imageChanged}
              aria-label={t('buttons.chooseImage')}
            />
          </div>

          <div className="mb-3">
            <label className="form-label form-item-label">{t('admin.store.products.clickwrapAgreementLabel')}</label>
            <LiquidInput value={product.clickwrap_agreement ?? ''} onChange={setClickwrapAgreement} />
          </div>
        </section>

        <section className="mt-4">
          <hr />
          <h3>{t('admin.store.products.paymentHeader')}</h3>

          <MultipleChoiceInput
            name="payment_options"
            caption={t('admin.store.products.paymentOptionsLabel')}
            choices={paymentOptionChoices}
            multiple
            value={product.payment_options}
            onChange={(newValue: string[]) => setPaymentOptions(newValue)}
            choiceClassName="form-check-inline"
          />

          <div>
            <PricingStructureForm
              pricingStructure={
                product.pricing_structure ?? {
                  __typename: 'PricingStructure',
                  pricing_strategy: PricingStrategy.Fixed,
                  value: {
                    __typename: 'Money',
                    currency_code: defaultCurrencyCode,
                    fractional: 0,
                  },
                }
              }
              setPricingStructure={setPricingStructure}
            />
          </div>
        </section>

        {!hideVariants && (
          <section className="mt-4">
            <hr />
            <h3>{t('admin.store.products.variantsHeader')}</h3>
            <AdminProductVariantsTable
              product={product}
              editing
              onChange={setProductVariants}
              deleteVariant={deleteVariant}
            />
          </section>
        )}
      </div>
    </div>
  );
}
