import describeCoupon from '../../../app/javascript/Store/describeCoupon';
import { buildMoney } from '../fixtures/store';

describe('describeCoupon', () => {
  it('describes a coupon that provides a free product', () => {
    expect(
      describeCoupon({
        percent_discount: null,
        fixed_amount: null,
        provides_product: { name: 'Dinner ticket' },
      }),
    ).toBe('1 free Dinner ticket');
  });

  it('describes a whole-number percentage discount without decimals', () => {
    expect(describeCoupon({ percent_discount: '25', fixed_amount: null })).toBe('25% off order');
    expect(describeCoupon({ percent_discount: '25.0', fixed_amount: null })).toBe('25% off order');
  });

  it('keeps the decimals on a fractional percentage discount', () => {
    expect(describeCoupon({ percent_discount: '12.5', fixed_amount: null })).toBe('12.5% off order');
  });

  it('describes a fixed amount discount', () => {
    expect(describeCoupon({ percent_discount: null, fixed_amount: buildMoney(1500) })).toBe('$15.00 off order');
  });

  it('prefers a free product over any discount', () => {
    expect(
      describeCoupon({
        percent_discount: '10',
        fixed_amount: buildMoney(500),
        provides_product: { name: 'Dinner ticket' },
      }),
    ).toBe('1 free Dinner ticket');
  });

  it('prefers a percentage over a fixed amount', () => {
    expect(describeCoupon({ percent_discount: '10', fixed_amount: buildMoney(500) })).toBe('10% off order');
  });

  it('says nothing for a coupon with no discount at all', () => {
    expect(describeCoupon({ percent_discount: null, fixed_amount: null })).toBe('');
    expect(describeCoupon({ percent_discount: '0', fixed_amount: null })).toBe('');
  });
});
