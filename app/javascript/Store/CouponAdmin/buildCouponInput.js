import { parseFloatOrNull, parseIntOrNull } from '../../ComposableFormUtils';
import buildMoneyInput from '../buildMoneyInput';

export default function buildCouponInput(coupon) {
  return {
    code: coupon.code,
    provides_product_id: coupon.provides_product?.id,
    fixed_amount: buildMoneyInput(coupon.fixed_amount),
    percent_discount: parseFloatOrNull(coupon.percent_discount),
    usage_limit: parseIntOrNull(coupon.usage_limit),
    expires_at: coupon.expires_at,
  };
}
