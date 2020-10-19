import { WithRealOrGeneratedId } from '../../GeneratedIdUtils';
import { AdminProductsQueryQuery } from '../queries.generated';

type QueryProduct = AdminProductsQueryQuery['convention']['products'][0];

export type EditingVariant = WithRealOrGeneratedId<QueryProduct['product_variants'][0], number>;

type EditingProductBase = Omit<QueryProduct, 'product_variants'> & {
  delete_variant_ids: number[];
  image?: File;
  product_variants: EditingVariant[];
};

export type EditingProduct = WithRealOrGeneratedId<EditingProductBase, number>;
