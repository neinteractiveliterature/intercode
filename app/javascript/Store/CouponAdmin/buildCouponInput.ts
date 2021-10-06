import { CouponInput } from '../../graphqlTypes.generated';
import buildMoneyInput from '../buildMoneyInput';
import { AdminCouponFieldsFragment } from './queries.generated';

export default function buildCouponInput(
  coupon: Pick<
    AdminCouponFieldsFragment,
    'code' | 'provides_product' | 'fixed_amount' | 'percent_discount' | 'usage_limit' | 'expires_at'
  >,
): CouponInput {
  const providesProductId = coupon.provides_product?.id;

  return {
    code: coupon.code,
    // blankProduct uses '' as its ID
    transitionalProvidesProductId: providesProductId === '' ? undefined : providesProductId,
    fixed_amount: buildMoneyInput(coupon.fixed_amount),
    percent_discount: coupon.percent_discount,
    usage_limit: coupon.usage_limit,
    expires_at: coupon.expires_at,
  };
}
