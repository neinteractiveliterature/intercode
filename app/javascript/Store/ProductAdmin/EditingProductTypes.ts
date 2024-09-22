import { RealIdObject, WithRealOrGeneratedId } from '../../GeneratedIdUtils';
import { AdminProductsQueryData } from './queries.generated';

type QueryProduct = AdminProductsQueryData['convention']['products'][0];

export type EditingVariant = WithRealOrGeneratedId<QueryProduct['product_variants'][0], string>;

export type EditingProductBase = Omit<QueryProduct, 'product_variants' | 'pricing_structure'> & {
  delete_variant_ids: string[];
  imageFile?: File;
  product_variants: EditingVariant[];
  pricing_structure?: QueryProduct['pricing_structure'];
};

export type EditingProduct = WithRealOrGeneratedId<EditingProductBase, string>;

export type EditingProductWithRealId = EditingProductBase & RealIdObject<QueryProduct['id']>;

export type EditingPricingStructure = NonNullable<EditingProduct['pricing_structure']>;

export function duplicateProductForEditing(
  product: AdminProductsQueryData['convention']['products'][0],
): EditingProductWithRealId {
  return {
    ...product,
    product_variants: product.product_variants.map((variant) => ({ ...variant })),
    delete_variant_ids: [],
  };
}
