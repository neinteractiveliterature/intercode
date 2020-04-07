import sortProductVariants from './sortProductVariants';

function buildMoneyInput(money) {
  return { fractional: money.fractional, currency_code: money.currency_code };
}

function buildPricingStructureInput(pricingStructure) {
  if (!pricingStructure) {
    return null;
  }

  let valueFields = {};

  if (pricingStructure.pricing_strategy === 'fixed') {
    valueFields = {
      fixed_value: buildMoneyInput(pricingStructure.value),
    };
  }

  if (pricingStructure.pricing_strategy === 'scheduled_value') {
    valueFields = {
      scheduled_value: {
        timespans: pricingStructure.value.timespans.map((timespan) => ({
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

export default function buildProductInput(product) {
  const imageInput = product.image ? { image: product.image } : {};
  return {
    name: product.name,
    available: product.available,
    description: product.description,
    payment_options: product.payment_options,
    pricing_structure: buildPricingStructureInput(product.pricing_structure),
    product_variants: sortProductVariants(product.product_variants).map((variant) => ({
      id: variant.id,
      name: variant.name,
      description: variant.description,
      override_pricing_structure: buildPricingStructureInput(variant.override_pricing_structure),
    })),
    delete_variant_ids: product.delete_variant_ids,
    provides_ticket_type_id: product.provides_ticket_type?.id || null,
    ...imageInput,
  };
}
