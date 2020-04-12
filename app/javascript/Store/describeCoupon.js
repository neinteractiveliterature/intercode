import formatMoney from '../formatMoney';

export default function describeCoupon(coupon) {
  if (coupon.provides_product) {
    return `1 free ${coupon.provides_product.name}`;
  }
  if (coupon.percent_discount) {
    return `${coupon.percent_discount}% off`;
  }
  if (coupon.fixed_amount) {
    return `${formatMoney(coupon.fixed_amount)} off`;
  }

  return '';
}
