import { AdminProductsQueryData } from '../../../app/javascript/Store/ProductAdmin/queries.generated';
import { buildFixedPricingStructure } from './store';

export type AdminProduct = AdminProductsQueryData['convention']['products'][number];
export type AdminProductVariant = AdminProduct['product_variants'][number];

export function buildAdminProductVariant(overrides: Partial<AdminProductVariant> = {}): AdminProductVariant {
  return {
    __typename: 'ProductVariant',
    id: '10',
    name: 'Small',
    description: null,
    position: 1,
    image: null,
    override_pricing_structure: null,
    ...overrides,
  };
}

export function buildAdminProduct(overrides: Partial<AdminProduct> = {}): AdminProduct {
  return {
    __typename: 'Product',
    id: '1',
    name: 'T-shirt',
    description: 'A shirt',
    description_html: '<p>A shirt</p>',
    available: true,
    payment_options: ['stripe'],
    clickwrap_agreement: null,
    clickwrap_agreement_html: null,
    image: null,
    pricing_structure: buildFixedPricingStructure(2000),
    product_variants: [],
    provides_ticket_type: null,
    ...overrides,
  };
}
