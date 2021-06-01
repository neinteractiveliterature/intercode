import { parseFloatOrNull } from '@neinteractiveliterature/litform';

import formatMoney from '../formatMoney';
import { Coupon, Product } from '../graphqlTypes.generated';

export default function describeCoupon(
  coupon: Pick<Coupon, 'percent_discount' | 'fixed_amount'> & {
    provides_product?: Pick<Product, 'name'> | null;
  },
) {
  if (coupon.provides_product) {
    return `1 free ${coupon.provides_product.name}`;
  }
  const percentDiscount = coupon.percent_discount
    ? parseFloatOrNull(coupon.percent_discount)
    : undefined;
  if (percentDiscount) {
    if (percentDiscount % 1.0 === 0.0) {
      return `${Math.floor(percentDiscount)}% off order`;
    }
    return `${percentDiscount}% off order`;
  }
  if (coupon.fixed_amount) {
    return `${formatMoney(coupon.fixed_amount)} off order`;
  }

  return '';
}
