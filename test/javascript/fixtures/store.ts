import { PricingStrategy } from '../../../app/javascript/graphqlTypes.generated';
import { OrderFormProductQueryData } from '../../../app/javascript/Store/queries.generated';
import { CartQueryData } from '../../../app/javascript/Store/Cart/queries.generated';

// Builders for store data (products, the cart).  Like the registration policy fixtures, they take overrides for what a
// test cares about and give everything else a sensible default.

export type MoneyData = { __typename: 'Money'; fractional: number; currency_code: string };

export function buildMoney(fractional: number, currencyCode = 'USD'): MoneyData {
  return { __typename: 'Money', fractional, currency_code: currencyCode };
}

export type OrderFormProduct = OrderFormProductQueryData['convention']['product'];
type ProductPricingStructure = OrderFormProduct['pricing_structure'];

export function buildFixedPricingStructure(fractional: number, currencyCode = 'USD'): ProductPricingStructure {
  return {
    __typename: 'PricingStructure',
    pricing_strategy: PricingStrategy.Fixed,
    price: buildMoney(fractional, currencyCode),
    value: buildMoney(fractional, currencyCode),
  };
}

export function buildPayWhatYouWantPricingStructure(
  value: { minimum?: number; maximum?: number; suggested?: number; currencyCode?: string } = {},
): ProductPricingStructure {
  const currencyCode = value.currencyCode ?? 'USD';
  const maybeMoney = (fractional?: number) => (fractional == null ? null : buildMoney(fractional, currencyCode));

  return {
    __typename: 'PricingStructure',
    pricing_strategy: PricingStrategy.PayWhatYouWant,
    price: null,
    value: {
      __typename: 'PayWhatYouWantValue',
      allowed_currency_codes: [currencyCode],
      minimum_amount: maybeMoney(value.minimum),
      maximum_amount: maybeMoney(value.maximum),
      suggested_amount: maybeMoney(value.suggested),
    },
  };
}

export function buildProductVariant(
  overrides: Partial<OrderFormProduct['product_variants'][number]> = {},
): OrderFormProduct['product_variants'][number] {
  return {
    __typename: 'ProductVariant',
    id: '1',
    name: 'Small',
    position: 1,
    override_pricing_structure: null,
    ...overrides,
  };
}

export function buildProduct(overrides: Partial<OrderFormProduct> = {}): OrderFormProduct {
  return {
    __typename: 'Product',
    id: '1',
    name: 'Test Product',
    description_html: null,
    clickwrap_agreement_html: null,
    pricing_structure: buildFixedPricingStructure(2000),
    provides_ticket_type: null,
    image: null,
    product_variants: [],
    ...overrides,
  };
}

export function buildProductQueryData(
  product: OrderFormProduct,
  { loggedIn = true }: { loggedIn?: boolean } = {},
): OrderFormProductQueryData {
  return {
    __typename: 'Query',
    currentUser: loggedIn ? { __typename: 'User', id: '1' } : null,
    convention: { __typename: 'Convention', id: '1', product },
  };
}

type CartOrder = NonNullable<NonNullable<CartQueryData['convention']['my_profile']>['current_pending_order']>;
export type CartOrderEntry = CartOrder['order_entries'][number];
export type CartCouponApplication = CartOrder['coupon_applications'][number];

export function buildCartOrderEntry(overrides: Partial<CartOrderEntry> = {}): CartOrderEntry {
  const pricePerItem = overrides.price_per_item ?? buildMoney(2000);
  const quantity = overrides.quantity ?? 1;

  return {
    __typename: 'OrderEntry',
    id: '1',
    quantity,
    product: {
      __typename: 'Product',
      id: '1',
      name: 'Test Product',
      payment_options: ['stripe'],
      provides_ticket_type: null,
    },
    product_variant: null,
    price_per_item: pricePerItem,
    price: buildMoney(pricePerItem.fractional * quantity, pricePerItem.currency_code),
    ...overrides,
  };
}

export function buildCartCouponApplication(overrides: Partial<CartCouponApplication> = {}): CartCouponApplication {
  return {
    __typename: 'CouponApplication',
    id: '1',
    discount: buildMoney(500),
    coupon: {
      __typename: 'Coupon',
      id: '1',
      code: 'SAVE5',
      percent_discount: null,
      fixed_amount: buildMoney(500),
      provides_product: null,
    },
    ...overrides,
  };
}

export function buildCartOrder(overrides: Partial<CartOrder> = {}): CartOrder {
  const orderEntries = overrides.order_entries ?? [buildCartOrderEntry()];
  const totalBeforeDiscounts = orderEntries.reduce((sum, entry) => sum + entry.price.fractional, 0);
  const discounts = (overrides.coupon_applications ?? []).reduce((sum, app) => sum + app.discount.fractional, 0);

  return {
    __typename: 'Order',
    id: '5',
    coupon_applications: [],
    order_entries: orderEntries,
    total_price_before_discounts: buildMoney(totalBeforeDiscounts),
    total_price: buildMoney(totalBeforeDiscounts - discounts),
    ...overrides,
  };
}

export function buildCartQueryData(order: CartOrder | null = null): CartQueryData {
  return {
    __typename: 'Query',
    convention: {
      __typename: 'Convention',
      id: '1',
      name: 'Test Convention',
      my_profile: {
        __typename: 'UserConProfile',
        id: '1',
        name_without_nickname: 'Test User',
        current_pending_order: order,
      },
    },
  };
}

export function buildEmptyCartQueryData(): CartQueryData {
  return buildCartQueryData(null);
}
