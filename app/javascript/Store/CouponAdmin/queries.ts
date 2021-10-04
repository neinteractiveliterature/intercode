import { gql } from '@apollo/client';

import { CouponFields } from '../couponFields';

export const AdminCouponFields = gql`
  fragment AdminCouponFields on Coupon {
    id: transitionalId
    ...CouponFields
    usage_limit
    expires_at
  }

  ${CouponFields}
`;

export const AdminCouponsQuery = gql`
  query AdminCouponsQuery(
    $filters: CouponFiltersInput
    $sort: [SortInput!]
    $page: Int
    $per_page: Int
  ) {
    convention: conventionByRequestHost {
      id: transitionalId
      coupons_paginated(filters: $filters, sort: $sort, page: $page, per_page: $per_page) {
        current_page
        total_pages

        entries {
          id: transitionalId
          ...AdminCouponFields
        }
      }
    }
  }

  ${AdminCouponFields}
`;
