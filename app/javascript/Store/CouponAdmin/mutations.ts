import { gql } from '@apollo/client';
import { AdminCouponFields } from './queries';

export const CreateCoupon = gql`
  mutation CreateCoupon($coupon: CouponInput!) {
    createCoupon(input: { coupon: $coupon }) {
      coupon {
        id
        ...AdminCouponFields
      }
    }
  }

  ${AdminCouponFields}
`;

export const UpdateCoupon = gql`
  mutation UpdateCoupon($id: ID!, $coupon: CouponInput!) {
    updateCoupon(input: { id: $id, coupon: $coupon }) {
      coupon {
        id
        ...AdminCouponFields
      }
    }
  }

  ${AdminCouponFields}
`;

export const DeleteCoupon = gql`
  mutation DeleteCoupon($id: ID!) {
    deleteCoupon(input: { id: $id }) {
      clientMutationId
    }
  }
`;
