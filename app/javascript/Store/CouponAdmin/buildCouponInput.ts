import { CouponInput } from '../../graphqlTypes.generated';
import buildMoneyInput from '../buildMoneyInput';
import { AdminCouponFieldsFragment } from './queries.generated';

export default function buildCouponInput(
  coupon: Pick<
    AdminCouponFieldsFragment,
    'code' | 'provides_product' | 'fixed_amount' | 'percent_discount' | 'usage_limit' | 'expires_at'
  >,
): CouponInput {
  return {
    code: coupon.code,
    provides_product_id: coupon.provides_product?.id,
    fixed_amount: buildMoneyInput(coupon.fixed_amount),
    percent_discount: coupon.percent_discount,
    usage_limit: coupon.usage_limit,
    expires_at: coupon.expires_at,
  };
}
