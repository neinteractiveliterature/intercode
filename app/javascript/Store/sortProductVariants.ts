import { ProductVariant } from '../graphqlTypes.generated';

type ProductVariantForSort = Pick<ProductVariant, 'id' | 'position'>;

const compareProductVariants = (a: ProductVariantForSort, b: ProductVariantForSort) => {
  if (a.position == null) {
    if (b.position == null) {
      return a.id - b.id;
    }

    return 1;
  }

  if (b.position == null) {
    return -1;
  }

  return a.position - b.position;
};

export default function sortProductVariants<T extends ProductVariantForSort>(variants: T[]) {
  return [...variants].sort(compareProductVariants);
}
