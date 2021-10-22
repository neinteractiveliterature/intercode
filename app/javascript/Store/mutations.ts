import { gql } from '@apollo/client';
import { AdminOrderFieldsFragment, OrderEntryFields, CartOrderFields } from './orderFields';
import { AdminProductFields } from './adminProductFields';

export const MarkOrderPaid = gql`
  mutation MarkOrderPaid($orderId: ID!) {
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
  mutation CancelOrder($orderId: ID!, $skipRefund: Boolean) {
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
    $userConProfileId: ID!
    $order: OrderInput!
    $status: OrderStatus!
    $orderEntries: [OrderEntryInput!]
  ) {
    createOrder(
      input: { userConProfileId: $userConProfileId, order: $order, status: $status, order_entries: $orderEntries }
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
  mutation AdminUpdateOrder($id: ID!, $order: OrderInput!) {
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
  mutation UpdateProduct($id: ID!, $product: ProductInput!) {
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
  mutation DeleteProduct($id: ID!) {
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
  mutation AddOrderEntryToCurrentPendingOrder($productId: ID!, $productVariantId: ID, $quantity: Int!) {
    addOrderEntryToCurrentPendingOrder(
      input: { order_entry: { productId: $productId, productVariantId: $productVariantId, quantity: $quantity } }
    ) {
      order_entry {
        id
      }
    }
  }
`;

export const CreateCouponApplication = gql`
  mutation CreateCouponApplication($orderId: ID!, $couponCode: String!) {
    createCouponApplication(input: { orderId: $orderId, coupon_code: $couponCode }) {
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
  mutation DeleteCouponApplication($id: ID!) {
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
