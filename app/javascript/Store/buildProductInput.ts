import sortProductVariants from './sortProductVariants';
import buildMoneyInput from './buildMoneyInput';
import {
  Money,
  PayWhatYouWantValue,
  PricingStructure,
  PricingStructureInput,
  ProductInput,
  ScheduledMoneyValue,
} from '../graphqlTypes.generated';
import { EditingProduct } from './ProductAdmin/EditingProductTypes';
import { hasRealId } from '../GeneratedIdUtils';
import invariant from 'tiny-invariant';

function buildPricingStructureInput(
  pricingStructure: Pick<PricingStructure, 'pricing_strategy' | 'value'> | null | undefined,
): PricingStructureInput | null {
  if (!pricingStructure) {
    return null;
  }

  let valueFields: Partial<PricingStructureInput> = {};

  if (pricingStructure.pricing_strategy === 'fixed') {
    valueFields = {
      fixed_value: buildMoneyInput(pricingStructure.value as Money),
    };
  }

  if (pricingStructure.pricing_strategy === 'scheduled_value') {
    valueFields = {
      scheduled_value: {
        timespans: (pricingStructure.value as ScheduledMoneyValue).timespans.map((timespan) => ({
          start: timespan.start,
          finish: timespan.finish,
          value: buildMoneyInput(timespan.value),
        })),
      },
    };
  }

  if (pricingStructure.pricing_strategy === 'pay_what_you_want') {
    valueFields = {
      pay_what_you_want_value: {
        minimumAmount: buildMoneyInput((pricingStructure.value as PayWhatYouWantValue).minimum_amount),
        maximumAmount: buildMoneyInput((pricingStructure.value as PayWhatYouWantValue).maximum_amount),
        suggestedAmount: buildMoneyInput((pricingStructure.value as PayWhatYouWantValue).suggested_amount),
        allowedCurrencyCodes: (pricingStructure.value as PayWhatYouWantValue).allowed_currency_codes,
      },
    };
  }

  return {
    pricing_strategy: pricingStructure.pricing_strategy,
    ...valueFields,
  };
}

function buildProductInput(product: EditingProduct): Omit<ProductInput, 'image'> {
  return {
    name: product.name,
    available: product.available,
    description: product.description,
    payment_options: product.payment_options,
    pricing_structure: buildPricingStructureInput(product.pricing_structure),
    product_variants: sortProductVariants(product.product_variants).map((variant) => ({
      id: hasRealId(variant) ? variant.id : undefined,
      name: variant.name,
      description: variant.description,
      override_pricing_structure: buildPricingStructureInput(variant.override_pricing_structure),
    })),
    deleteVariantIds: product.delete_variant_ids,
    providesTicketTypeId: product.provides_ticket_type?.id || null,
    clickwrapAgreement: product.clickwrap_agreement,
  };
}

export function buildProductFormData(product: EditingProduct): FormData {
  const productInput = buildProductInput(product);
  const formData = new FormData();
  formData.set('productInput', JSON.stringify(productInput));
  if (product.imageFile != null) {
    formData.set('image', product.imageFile);
  }
  return formData;
}

export function parseProductFormData(formData: FormData): ProductInput {
  const inputJSON = formData.get('productInput');
  invariant(typeof inputJSON === 'string');
  const input = JSON.parse(inputJSON);
  const image = formData.get('image');

  return {
    ...input,
    image: image instanceof File ? image : undefined,
  };
}
