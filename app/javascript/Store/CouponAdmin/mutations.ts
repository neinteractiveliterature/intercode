import { gql } from '@apollo/client';
import { AdminCouponFields } from './queries';

export const CreateCoupon = gql`
  mutation CreateCoupon($coupon: CouponInput!) {
    createCoupon(input: { coupon: $coupon }) {
      coupon {
        id: transitionalId
        ...AdminCouponFields
      }
    }
  }

  ${AdminCouponFields}
`;

export const UpdateCoupon = gql`
  mutation UpdateCoupon($id: ID!, $coupon: CouponInput!) {
    updateCoupon(input: { transitionalId: $id, coupon: $coupon }) {
      coupon {
        id: transitionalId
        ...AdminCouponFields
      }
    }
  }

  ${AdminCouponFields}
`;

export const DeleteCoupon = gql`
  mutation DeleteCoupon($id: ID!) {
    deleteCoupon(input: { transitionalId: $id }) {
      clientMutationId
    }
  }
`;
