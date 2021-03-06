import { gql } from '@apollo/client';
import { AdminOrderFieldsFragment, CartOrderFields, CouponApplicationFields } from './orderFields';
import { AdminProductFields } from './adminProductFields';
import { PricingStructureFields } from './pricingStructureFields';

export const AdminOrdersQuery = gql`
  query AdminOrdersQuery(
    $page: Int
    $perPage: Int
    $filters: OrderFiltersInput
    $sort: [SortInput!]
  ) {
    currentAbility {
      can_create_orders
      can_update_orders
    }

    convention: assertConvention {
      id
      timezone_name

      orders_paginated(page: $page, per_page: $perPage, filters: $filters, sort: $sort) {
        current_page
        per_page
        total_pages

        entries {
          id
          ...AdminOrderFieldsFragment
        }
      }
    }
  }

  ${AdminOrderFieldsFragment}
`;

export const AdminProductsQuery = gql`
  query AdminProductsQuery {
    convention: assertConvention {
      id
      products {
        id
        ...AdminProductFields
      }
      ticket_types {
        id
        description
      }
    }

    currentAbility {
      can_update_products
    }
  }

  ${AdminProductFields}
`;

export const AdminStoreAbilityQuery = gql`
  query AdminStoreAbilityQuery {
    currentAbility {
      can_update_products
      can_update_orders
    }

    convention: assertConvention {
      id
      timezone_name
    }
  }
`;

export const CartQuery = gql`
  query CartQuery {
    myProfile {
      id
      name_without_nickname
    }

    convention: assertConvention {
      id
      name
    }

    currentPendingOrder {
      id
      ...CartOrderFields
    }
  }

  ${CartOrderFields}
`;

export const OrderHistoryQuery = gql`
  query OrderHistoryQuery {
    convention: assertConvention {
      id
      name
      timezone_name

      staff_positions {
        id
        name
        email
      }
    }

    myProfile {
      id
      name_without_nickname

      orders {
        id
        status
        submitted_at

        total_price {
          fractional
          currency_code
        }

        payment_amount {
          fractional
          currency_code
        }

        coupon_applications {
          id
          ...CouponApplicationFields
        }

        order_entries {
          id
          quantity

          product {
            id
            name
            image_url
            payment_options
          }

          product_variant {
            id
            name
            image_url
          }

          price_per_item {
            fractional
            currency_code
          }

          price {
            fractional
            currency_code
          }
        }
      }
    }
  }

  ${CouponApplicationFields}
`;

export const OrderSummaryQuery = gql`
  query OrderSummaryQuery {
    convention: assertConvention {
      id
      products {
        id
        name

        order_quantities_by_status {
          status
          quantity
        }

        product_variants {
          id
          name

          order_quantities_by_status {
            status
            quantity
          }
        }
      }
    }
  }
`;

export const OrderFormProductQuery = gql`
  query OrderFormProductQuery($productId: Int!) {
    currentUser {
      id
    }

    product(id: $productId) {
      id
      image_url
      name
      pricing_structure {
        ...PricingStructureFields
      }
      description_html
      provides_ticket_type {
        id
      }

      product_variants {
        id
        name
        position
        override_pricing_structure {
          ...PricingStructureFields
        }
      }
    }
  }

  ${PricingStructureFields}
`;

export const CurrentPendingOrderPaymentIntentClientSecret = gql`
  query CurrentPendingOrderPaymentIntentClientSecretQuery {
    currentPendingOrderPaymentIntentClientSecret
  }
`;
