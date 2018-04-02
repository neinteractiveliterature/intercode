import gql from 'graphql-tag';

export const adminOrderFragment = gql`
fragment AdminOrderFieldsFragment on Order {
  id
  status
  submitted_at
  charge_id
  payment_note

  user_con_profile {
    name_without_nickname
  }

  total_price {
    fractional
    currency_code
  }

  order_entries {
    id
    describe_products
  }
}
`;

export const adminOrdersQuery = gql`
query($page: Int, $perPage: Int, $filters: OrderFiltersInput, $sort: [SortInput]) {
  convention {
    timezone_name

    orders_paginated(page: $page, per_page: $perPage, filters: $filters, sort: $sort) {
      current_page
      per_page
      total_pages

      entries {
        ...AdminOrderFieldsFragment
      }
    }
  }
}

${adminOrderFragment}
`;
