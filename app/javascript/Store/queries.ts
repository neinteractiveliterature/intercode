import { gql } from '@apollo/client';
import { AdminOrderFieldsFragment, CartOrderFields, CouponApplicationFields } from './orderFields';
import { AdminProductFields } from './adminProductFields';
import { PricingStructureFields } from './pricingStructureFields';

export const AdminOrdersQuery = gql`
  query AdminOrdersQuery($page: Int, $perPage: Int, $filters: OrderFiltersInput, $sort: [SortInput!]) {
    currentAbility {
      can_create_orders
      can_update_orders
    }

    convention: conventionByRequestHost {
      id: transitionalId
      timezone_name

      orders_paginated(page: $page, per_page: $perPage, filters: $filters, sort: $sort) {
        current_page
        per_page
        total_pages

        entries {
          id: transitionalId
          ...AdminOrderFieldsFragment
        }
      }
    }
  }

  ${AdminOrderFieldsFragment}
`;

export const AdminProductsQuery = gql`
  query AdminProductsQuery {
    convention: conventionByRequestHost {
      id: transitionalId
      products {
        id: transitionalId
        ...AdminProductFields
      }
      ticket_types {
        id: transitionalId
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

    convention: conventionByRequestHost {
      id: transitionalId
      timezone_name
    }
  }
`;

export const CartQuery = gql`
  query CartQuery {
    convention: conventionByRequestHost {
      id: transitionalId
      name

      my_profile {
        id: transitionalId
        name_without_nickname

        current_pending_order {
          id: transitionalId
          ...CartOrderFields
        }
      }
    }
  }

  ${CartOrderFields}
`;

export const OrderHistoryQuery = gql`
  query OrderHistoryQuery {
    convention: conventionByRequestHost {
      id: transitionalId
      name
      timezone_name

      staff_positions {
        id: transitionalId
        name
        email
      }

      my_profile {
        id: transitionalId
        name_without_nickname

        orders {
          id: transitionalId
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
            id: transitionalId
            ...CouponApplicationFields
          }

          order_entries {
            id: transitionalId
            quantity

            product {
              id: transitionalId
              name
              image_url
              payment_options
            }

            product_variant {
              id: transitionalId
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
  }

  ${CouponApplicationFields}
`;

export const OrderSummaryQuery = gql`
  query OrderSummaryQuery {
    convention: conventionByRequestHost {
      id: transitionalId
      products {
        id: transitionalId
        name

        order_quantities_by_status {
          status
          quantity
        }

        product_variants {
          id: transitionalId
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
  query OrderFormProductQuery($productId: ID!) {
    currentUser {
      id: transitionalId
    }

    convention: conventionByRequestHost {
      id: transitionalId
      product(transitionalId: $productId) {
        id: transitionalId
        image_url
        name
        pricing_structure {
          ...PricingStructureFields
        }
        description_html
        provides_ticket_type {
          id: transitionalId
        }

        product_variants {
          id: transitionalId
          name
          position
          override_pricing_structure {
            ...PricingStructureFields
          }
        }
      }
    }
  }

  ${PricingStructureFields}
`;

export const CurrentPendingOrderPaymentIntentClientSecret = gql`
  query CurrentPendingOrderPaymentIntentClientSecretQuery {
    convention: conventionByRequestHost {
      id: transitionalId
      my_profile {
        id: transitionalId
        current_pending_order {
          id: transitionalId
          payment_intent_client_secret
        }
      }
    }
  }
`;
