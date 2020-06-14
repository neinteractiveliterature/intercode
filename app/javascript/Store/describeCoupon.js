import formatMoney from '../formatMoney';

export default function describeCoupon(coupon) {
  if (coupon.provides_product) {
    return `1 free ${coupon.provides_product.name}`;
  }
  if (coupon.percent_discount) {
    if (coupon.percent_discount % 1.0 === 0.0) {
      return `${Math.floor(coupon.percent_discount)}% off order`;
    }
    return `${coupon.percent_discount}% off order`;
  }
  if (coupon.fixed_amount) {
    return `${formatMoney(coupon.fixed_amount)} off order`;
  }

  return '';
}
