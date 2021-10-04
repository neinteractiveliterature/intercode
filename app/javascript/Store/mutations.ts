import { gql } from '@apollo/client';
import { AdminOrderFieldsFragment, OrderEntryFields, CartOrderFields } from './orderFields';
import { AdminProductFields } from './adminProductFields';

export const MarkOrderPaid = gql`
  mutation MarkOrderPaid($orderId: ID!) {
    markOrderPaid(input: { transitionalId: $orderId }) {
      order {
        id: transitionalId
        ...AdminOrderFieldsFragment
      }
    }
  }

  ${AdminOrderFieldsFragment}
`;

export const CancelOrder = gql`
  mutation CancelOrder($orderId: ID!, $skipRefund: Boolean) {
    cancelOrder(input: { transitionalId: $orderId, skip_refund: $skipRefund }) {
      order {
        id: transitionalId
        ...AdminOrderFieldsFragment
      }
    }
  }

  ${AdminOrderFieldsFragment}
`;

export const CreateOrder = gql`
  mutation CreateOrder(
    $userConProfileId: ID!
    $order: OrderInput!
    $status: OrderStatus!
    $orderEntries: [OrderEntryInput!]
  ) {
    createOrder(
      input: {
        transitionalUserConProfileId: $userConProfileId
        order: $order
        status: $status
        order_entries: $orderEntries
      }
    ) {
      order {
        id: transitionalId
        ...AdminOrderFieldsFragment
      }
    }
  }

  ${AdminOrderFieldsFragment}
`;

export const AdminUpdateOrder = gql`
  mutation AdminUpdateOrder($id: ID!, $order: OrderInput!) {
    updateOrder(input: { transitionalId: $id, order: $order }) {
      order {
        id: transitionalId
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
        id: transitionalId
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
        id: transitionalId
        ...AdminProductFields
      }
    }
  }

  ${AdminProductFields}
`;

export const DeleteProduct = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(input: { transitionalId: $id }) {
      product {
        id: transitionalId
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
        id: transitionalId
        ...OrderEntryFields

        order {
          id: transitionalId
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
        id: transitionalId
        ...OrderEntryFields

        order {
          id: transitionalId
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
        id: transitionalId
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
        id: transitionalId
      }
    }
  }
`;

export const AdminDeleteOrderEntry = gql`
  mutation AdminDeleteOrderEntry($input: DeleteOrderEntryInput!) {
    deleteOrderEntry(input: $input) {
      order_entry {
        id: transitionalId

        order {
          id: transitionalId
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
        id: transitionalId
        status
      }
    }
  }
`;

export const AddOrderEntryToCurrentPendingOrder = gql`
  mutation AddOrderEntryToCurrentPendingOrder(
    $productId: ID!
    $productVariantId: ID
    $quantity: Int!
  ) {
    addOrderEntryToCurrentPendingOrder(
      input: {
        order_entry: {
          transitionalProductId: $productId
          transitionalProductVariantId: $productVariantId
          quantity: $quantity
        }
      }
    ) {
      order_entry {
        id: transitionalId
      }
    }
  }
`;

export const CreateCouponApplication = gql`
  mutation CreateCouponApplication($orderId: ID!, $couponCode: String!) {
    createCouponApplication(input: { transitionalOrderId: $orderId, coupon_code: $couponCode }) {
      coupon_application {
        id: transitionalId
        order {
          id: transitionalId
          ...CartOrderFields
        }
      }
    }
  }

  ${CartOrderFields}
`;

export const DeleteCouponApplication = gql`
  mutation DeleteCouponApplication($id: ID!) {
    deleteCouponApplication(input: { transitionalId: $id }) {
      coupon_application {
        id: transitionalId
        order {
          id: transitionalId
          ...CartOrderFields
        }
      }
    }
  }

  ${CartOrderFields}
`;
