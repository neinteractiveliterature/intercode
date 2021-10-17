import { ProductVariant } from '../graphqlTypes.generated';

type ProductVariantForSort = Partial<Pick<ProductVariant, 'position'> & { id: string }>;

const compareProductVariants = (a: ProductVariantForSort, b: ProductVariantForSort) => {
  if (a.position == null) {
    if (b.position == null) {
      if (a.id && b.id) {
        return a.id.localeCompare(b.id);
      }

      return 0;
    }

    return 1;
  }

  if (b.position == null) {
    return -1;
  }

  return a.position - b.position;
};

export default function sortProductVariants<T extends ProductVariantForSort>(variants: T[]): T[] {
  return [...variants].sort(compareProductVariants);
}
