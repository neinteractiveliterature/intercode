import buildMoneyInput from '../../../app/javascript/Store/buildMoneyInput';
import buildCouponInput from '../../../app/javascript/Store/CouponAdmin/buildCouponInput';
import { buildProductFormData, parseProductFormData } from '../../../app/javascript/Store/buildProductInput';
import sortProductVariants from '../../../app/javascript/Store/sortProductVariants';
import { EditingProduct, EditingVariant } from '../../../app/javascript/Store/ProductAdmin/EditingProductTypes';
import { PricingStrategy } from '../../../app/javascript/graphqlTypes.generated';
import { buildMoney } from '../fixtures/store';

describe('buildMoneyInput', () => {
  it('keeps just the amount and currency, dropping __typename', () => {
    expect(buildMoneyInput(buildMoney(2500, 'EUR'))).toEqual({ fractional: 2500, currency_code: 'EUR' });
  });

  it.each([null, undefined])('gives null for %s', (value) => {
    expect(buildMoneyInput(value)).toBeNull();
  });

  it('keeps a zero amount rather than treating it as missing', () => {
    expect(buildMoneyInput(buildMoney(0))).toEqual({ fractional: 0, currency_code: 'USD' });
  });
});

describe('buildCouponInput', () => {
  const coupon = {
    code: 'SAVE5',
    provides_product: null,
    fixed_amount: buildMoney(500),
    percent_discount: null,
    usage_limit: 10,
    expires_at: '2026-12-31T00:00:00Z',
  };

  it('builds the input for a fixed-amount coupon', () => {
    expect(buildCouponInput(coupon)).toEqual({
      code: 'SAVE5',
      providesProductId: undefined,
      fixed_amount: { fractional: 500, currency_code: 'USD' },
      percent_discount: null,
      usage_limit: 10,
      expires_at: '2026-12-31T00:00:00Z',
    });
  });

  it('builds the input for a percentage coupon, with no fixed amount', () => {
    const input = buildCouponInput({ ...coupon, fixed_amount: null, percent_discount: '15', usage_limit: null });

    expect(input).toMatchObject({ fixed_amount: null, percent_discount: '15', usage_limit: null });
  });

  it('refers to the product a coupon provides by its id', () => {
    const input = buildCouponInput({ ...coupon, provides_product: { __typename: 'Product', id: '7', name: 'Shirt' } });

    expect(input.providesProductId).toBe('7');
  });

  it('treats the blank product placeholder (id "") as no product', () => {
    const input = buildCouponInput({ ...coupon, provides_product: { __typename: 'Product', id: '', name: '' } });

    expect(input.providesProductId).toBeUndefined();
  });
});

describe('sortProductVariants', () => {
  it('orders by position', () => {
    const sorted = sortProductVariants([
      { id: 'a', position: 3 },
      { id: 'b', position: 1 },
      { id: 'c', position: 2 },
    ]);

    expect(sorted.map((variant) => variant.id)).toEqual(['b', 'c', 'a']);
  });

  it('puts variants without a position (new ones) last, in id order', () => {
    const sorted = sortProductVariants([{ id: 'z' }, { id: 'a', position: 1 }, { id: 'b' }]);

    expect(sorted.map((variant) => variant.id)).toEqual(['a', 'b', 'z']);
  });

  it('does not change the array it was given', () => {
    const variants = [{ position: 2 }, { position: 1 }];

    sortProductVariants(variants);

    expect(variants).toEqual([{ position: 2 }, { position: 1 }]);
  });
});

describe('buildProductFormData and parseProductFormData', () => {
  const buildVariant = (overrides: Partial<EditingVariant> = {}): EditingVariant => ({
    __typename: 'ProductVariant',
    id: '1',
    name: 'Small',
    description: null,
    position: 1,
    image: null,
    override_pricing_structure: null,
    ...overrides,
  });

  const buildProduct = (overrides: Partial<EditingProduct> = {}): EditingProduct => ({
    __typename: 'Product',
    id: '10',
    name: 'T-shirt',
    description: 'A shirt',
    description_html: '<p>A shirt</p>',
    available: true,
    payment_options: ['stripe'],
    clickwrap_agreement: null,
    clickwrap_agreement_html: null,
    image: null,
    provides_ticket_type: null,
    pricing_structure: {
      __typename: 'PricingStructure',
      pricing_strategy: PricingStrategy.Fixed,
      price: buildMoney(2000),
      value: buildMoney(2000),
    },
    product_variants: [],
    delete_variant_ids: [],
    ...overrides,
  });

  const roundTrip = (product: EditingProduct) => parseProductFormData(buildProductFormData(product));

  it('carries the product’s own fields', () => {
    const input = roundTrip(
      buildProduct({
        available: false,
        payment_options: ['stripe', 'pay_at_convention'],
        clickwrap_agreement: 'I agree',
      }),
    );

    expect(input).toMatchObject({
      name: 'T-shirt',
      available: false,
      description: 'A shirt',
      payment_options: ['stripe', 'pay_at_convention'],
      clickwrapAgreement: 'I agree',
      deleteVariantIds: [],
    });
  });

  describe('pricing structures', () => {
    it('builds a fixed price', () => {
      expect(roundTrip(buildProduct()).pricing_structure).toEqual({
        pricing_strategy: 'fixed',
        fixed_value: { fractional: 2000, currency_code: 'USD' },
      });
    });

    it('builds a scheduled price from its timespans', () => {
      const input = roundTrip(
        buildProduct({
          pricing_structure: {
            __typename: 'PricingStructure',
            pricing_strategy: PricingStrategy.ScheduledValue,
            value: {
              __typename: 'ScheduledMoneyValue',
              timespans: [
                {
                  __typename: 'TimespanWithMoneyValue',
                  start: null,
                  finish: '2026-06-01T00:00:00Z',
                  value: buildMoney(1500),
                },
                {
                  __typename: 'TimespanWithMoneyValue',
                  start: '2026-06-01T00:00:00Z',
                  finish: null,
                  value: buildMoney(2500),
                },
              ],
            },
          },
        }),
      );

      expect(input.pricing_structure).toEqual({
        pricing_strategy: 'scheduled_value',
        scheduled_value: {
          timespans: [
            { start: null, finish: '2026-06-01T00:00:00Z', value: { fractional: 1500, currency_code: 'USD' } },
            { start: '2026-06-01T00:00:00Z', finish: null, value: { fractional: 2500, currency_code: 'USD' } },
          ],
        },
      });
    });

    it('builds a pay-what-you-want price with whichever amounts are set', () => {
      const input = roundTrip(
        buildProduct({
          pricing_structure: {
            __typename: 'PricingStructure',
            pricing_strategy: PricingStrategy.PayWhatYouWant,
            value: {
              __typename: 'PayWhatYouWantValue',
              minimum_amount: buildMoney(500),
              maximum_amount: null,
              suggested_amount: buildMoney(1000),
              allowed_currency_codes: ['USD', 'EUR'],
            },
          },
        }),
      );

      expect(input.pricing_structure).toEqual({
        pricing_strategy: 'pay_what_you_want',
        pay_what_you_want_value: {
          minimumAmount: { fractional: 500, currency_code: 'USD' },
          maximumAmount: null,
          suggestedAmount: { fractional: 1000, currency_code: 'USD' },
          allowedCurrencyCodes: ['USD', 'EUR'],
        },
      });
    });

    it('is null when no pricing strategy has been chosen', () => {
      expect(roundTrip(buildProduct({ pricing_structure: {} })).pricing_structure).toBeNull();
      expect(roundTrip(buildProduct({ pricing_structure: undefined })).pricing_structure).toBeNull();
    });
  });

  describe('variants', () => {
    it('sends them in position order, with ids only for the ones that already exist', () => {
      const input = roundTrip(
        buildProduct({
          product_variants: [
            { ...buildVariant({ name: 'Large', position: 3 }), id: '30' },
            { ...buildVariant({ name: 'Small', position: 1 }), id: '10' },
            // a new variant has a generated id instead of a real one
            {
              __typename: 'ProductVariant',
              generatedId: 'new-1',
              name: 'Medium',
              description: 'Mid',
              position: 2,
              image: null,
              override_pricing_structure: null,
            } as EditingVariant,
          ],
        }),
      );

      expect(input.product_variants?.map((variant) => [variant.id, variant.name])).toEqual([
        ['10', 'Small'],
        [undefined, 'Medium'],
        ['30', 'Large'],
      ]);
    });

    it('builds each variant’s own price override, or null if it has none', () => {
      const input = roundTrip(
        buildProduct({
          product_variants: [
            buildVariant({ id: '1', position: 1 }),
            buildVariant({
              id: '2',
              position: 2,
              override_pricing_structure: {
                __typename: 'PricingStructure',
                pricing_strategy: PricingStrategy.Fixed,
                value: buildMoney(2500),
              },
            }),
          ],
        }),
      );

      expect(input.product_variants?.[0].override_pricing_structure).toBeNull();
      expect(input.product_variants?.[1].override_pricing_structure).toEqual({
        pricing_strategy: 'fixed',
        fixed_value: { fractional: 2500, currency_code: 'USD' },
      });
    });

    it('passes along which variants to delete', () => {
      expect(roundTrip(buildProduct({ delete_variant_ids: ['4', '5'] })).deleteVariantIds).toEqual(['4', '5']);
    });
  });

  describe('the ticket type the product provides', () => {
    it('is its id', () => {
      const input = roundTrip(
        buildProduct({ provides_ticket_type: { __typename: 'TicketType', id: '3', description: 'Weekend pass' } }),
      );

      expect(input.providesTicketTypeId).toBe('3');
    });

    it('is null when it provides none', () => {
      expect(roundTrip(buildProduct()).providesTicketTypeId).toBeNull();
    });
  });

  describe('the image', () => {
    it('is sent as its own form field, and comes back as the file', () => {
      const imageFile = new File(['pixels'], 'shirt.png', { type: 'image/png' });

      const formData = buildProductFormData(buildProduct({ imageFile }));

      expect(formData.get('image')).toBeInstanceOf(File);
      expect(parseProductFormData(formData).image).toBeInstanceOf(File);
      expect((parseProductFormData(formData).image as File).name).toBe('shirt.png');
    });

    it('is left out when there is no new image', () => {
      const formData = buildProductFormData(buildProduct());

      expect(formData.has('image')).toBe(false);
      expect(parseProductFormData(formData).image).toBeUndefined();
    });
  });

  it('refuses form data without a product input', () => {
    expect(() => parseProductFormData(new FormData())).toThrow();
  });
});
