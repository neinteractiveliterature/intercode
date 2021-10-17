import sortProductVariants from './sortProductVariants';
import buildMoneyInput from './buildMoneyInput';
import {
  Money,
  PricingStructure,
  PricingStructureInput,
  ProductInput,
  ScheduledMoneyValue,
} from '../graphqlTypes.generated';
import { EditingProduct } from './ProductAdmin/EditingProductTypes';
import { hasRealId } from '../GeneratedIdUtils';

function buildPricingStructureInput(
  pricingStructure: Pick<PricingStructure, 'pricing_strategy' | 'value'> | null | undefined,
): PricingStructureInput | null {
  if (!pricingStructure) {
    return null;
  }

  let valueFields = {};

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

  return {
    pricing_strategy: pricingStructure.pricing_strategy,
    ...valueFields,
  };
}

export default function buildProductInput(product: EditingProduct): ProductInput {
  const imageInput = product.image ? { image: product.image } : {};
  return {
    name: product.name,
    available: product.available,
    description: product.description,
    payment_options: product.payment_options,
    pricing_structure: buildPricingStructureInput(product.pricing_structure),
    product_variants: sortProductVariants(product.product_variants).map((variant) => ({
      transitionalId: hasRealId(variant) ? variant.id : undefined,
      name: variant.name,
      description: variant.description,
      override_pricing_structure: buildPricingStructureInput(variant.override_pricing_structure),
    })),
    transitionalDeleteVariantIds: product.delete_variant_ids,
    transitionalProvidesTicketTypeId: product.provides_ticket_type?.id || null,
    ...imageInput,
  };
}
