import { gql } from '@apollo/client';
import { AdminOrderFieldsFragment, OrderEntryFields, CartOrderFields } from './orderFields';
import { AdminProductFields } from './adminProductFields';

export const MarkOrderPaid = gql`
  mutation MarkOrderPaid($orderId: Int!) {
    markOrderPaid(input: { id: $orderId }) {
      order {
        id
        ...AdminOrderFieldsFragment
      }
    }
  }

  ${AdminOrderFieldsFragment}
`;

export const CancelOrder = gql`
  mutation CancelOrder($orderId: Int!, $skipRefund: Boolean) {
    cancelOrder(input: { id: $orderId, skip_refund: $skipRefund }) {
      order {
        id
        ...AdminOrderFieldsFragment
      }
    }
  }

  ${AdminOrderFieldsFragment}
`;

export const CreateOrder = gql`
  mutation CreateOrder(
    $userConProfileId: Int!
    $order: OrderInput!
    $status: OrderStatus!
    $orderEntries: [OrderEntryInput!]
  ) {
    createOrder(
      input: {
        user_con_profile_id: $userConProfileId
        order: $order
        status: $status
        order_entries: $orderEntries
      }
    ) {
      order {
        id
        ...AdminOrderFieldsFragment
      }
    }
  }

  ${AdminOrderFieldsFragment}
`;

export const AdminUpdateOrder = gql`
  mutation AdminUpdateOrder($id: Int!, $order: OrderInput!) {
    updateOrder(input: { id: $id, order: $order }) {
      order {
        id
        ...AdminOrderFieldsFragment
      }
    }
  }

  ${AdminOrderFieldsFragment}
`;

export const CreateProduct = gql`
  mutation CreateProduct($product: ProductInput!) {
    createProduct(input: { product: $product }) {
      product {
        id
        ...AdminProductFields
      }
    }
  }

  ${AdminProductFields}
`;

export const UpdateProduct = gql`
  mutation UpdateProduct($id: Int!, $product: ProductInput!) {
    updateProduct(input: { id: $id, product: $product }) {
      product {
        id
        ...AdminProductFields
      }
    }
  }

  ${AdminProductFields}
`;

export const DeleteProduct = gql`
  mutation DeleteProduct($id: Int!) {
    deleteProduct(input: { id: $id }) {
      product {
        id
        ...AdminProductFields
      }
    }
  }

  ${AdminProductFields}
`;

export const AdminCreateOrderEntry = gql`
  mutation AdminCreateOrderEntry($input: CreateOrderEntryInput!) {
    createOrderEntry(input: $input) {
      order_entry {
        id
        ...OrderEntryFields

        order {
          id
          ...AdminOrderFieldsFragment
        }
      }
    }
  }

  ${OrderEntryFields}
  ${AdminOrderFieldsFragment}
`;

export const AdminUpdateOrderEntry = gql`
  mutation AdminUpdateOrderEntry($input: UpdateOrderEntryInput!) {
    updateOrderEntry(input: $input) {
      order_entry {
        id
        ...OrderEntryFields

        order {
          id
          ...AdminOrderFieldsFragment
        }
      }
    }
  }

  ${OrderEntryFields}
  ${AdminOrderFieldsFragment}
`;

export const UpdateOrderEntry = gql`
  mutation UpdateOrderEntry($input: UpdateOrderEntryInput!) {
    updateOrderEntry(input: $input) {
      order_entry {
        id
        ...OrderEntryFields
      }
    }
  }

  ${OrderEntryFields}
`;

export const DeleteOrderEntry = gql`
  mutation DeleteOrderEntry($input: DeleteOrderEntryInput!) {
    deleteOrderEntry(input: $input) {
      order_entry {
        id
      }
    }
  }
`;

export const AdminDeleteOrderEntry = gql`
  mutation AdminDeleteOrderEntry($input: DeleteOrderEntryInput!) {
    deleteOrderEntry(input: $input) {
      order_entry {
        id

        order {
          id
          ...AdminOrderFieldsFragment
        }
      }
    }
  }

  ${AdminOrderFieldsFragment}
`;

export const SubmitOrder = gql`
  mutation SubmitOrder($input: SubmitOrderInput!) {
    submitOrder(input: $input) {
      order {
        id
        status
      }
    }
  }
`;

export const AddOrderEntryToCurrentPendingOrder = gql`
  mutation AddOrderEntryToCurrentPendingOrder(
    $productId: Int!
    $productVariantId: Int
    $quantity: Int!
  ) {
    addOrderEntryToCurrentPendingOrder(
      input: {
        order_entry: {
          product_id: $productId
          product_variant_id: $productVariantId
          quantity: $quantity
        }
      }
    ) {
      order_entry {
        id
      }
    }
  }
`;

export const CreateCouponApplication = gql`
  mutation CreateCouponApplication($orderId: Int!, $couponCode: String!) {
    createCouponApplication(input: { order_id: $orderId, coupon_code: $couponCode }) {
      coupon_application {
        id
        order {
          id
          ...CartOrderFields
        }
      }
    }
  }

  ${CartOrderFields}
`;

export const DeleteCouponApplication = gql`
  mutation DeleteCouponApplication($id: Int!) {
    deleteCouponApplication(input: { id: $id }) {
      coupon_application {
        id
        order {
          id
          ...CartOrderFields
        }
      }
    }
  }

  ${CartOrderFields}
`;
