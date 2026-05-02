import { RealIdObject, WithRealOrGeneratedId } from '../../GeneratedIdUtils';
import { PricingStructure } from '../../graphqlTypes.generated';
import { AdminProductsQueryData } from './queries.generated';

type QueryProduct = AdminProductsQueryData['convention']['products'][0];

export type EditingVariant = WithRealOrGeneratedId<
  Omit<QueryProduct['product_variants'][0], 'override_pricing_structure'> & {
    override_pricing_structure?: Partial<PricingStructure> | null;
  },
  string
>;

export type EditingProductBase = Omit<QueryProduct, 'product_variants' | 'pricing_structure'> & {
  delete_variant_ids: string[];
  imageFile?: File;
  product_variants: EditingVariant[];
  pricing_structure?: Partial<PricingStructure>;
};

export type EditingProduct = WithRealOrGeneratedId<EditingProductBase, string>;

export type EditingProductWithRealId = EditingProductBase & RealIdObject<QueryProduct['id']>;

export type EditingPricingStructure = Partial<PricingStructure>;

export function duplicateProductForEditing(
  product: AdminProductsQueryData['convention']['products'][0],
): EditingProductWithRealId {
  return {
    ...product,
    product_variants: product.product_variants.map((variant) => ({ ...variant })),
    delete_variant_ids: [],
  };
}
