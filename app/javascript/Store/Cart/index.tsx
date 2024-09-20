import { useCallback } from 'react';
import { LoaderFunction, useFetcher, useLoaderData, useNavigate } from 'react-router-dom';
import { ApolloError } from '@apollo/client';
import { useModal, useConfirm, ErrorDisplay } from '@neinteractiveliterature/litform';
import { CartQueryData, CartQueryDocument } from './queries.generated';
import { client } from 'useIntercodeApolloClient';
import usePageTitle from 'usePageTitle';
import useLoginRequired from 'Authentication/useLoginRequired';
import CartContents from './CartContents';
import OrderPaymentModal from 'Store/OrderPaymentModal';

type OrderEntryType = NonNullable<
  NonNullable<CartQueryData['convention']['my_profile']>['current_pending_order']
>['order_entries'][0];

export const loader: LoaderFunction = async () => {
  const { data } = await client.query<CartQueryData>({ query: CartQueryDocument });
  return data;
};

function Cart() {
  const data = useLoaderData() as CartQueryData;
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const error = fetcher.data instanceof Error ? fetcher.data : undefined;
  const checkOutModal = useModal();
  const confirm = useConfirm();

  usePageTitle('Cart');

  const updateOrderEntry = useCallback(
    (id: string, quantity: number) =>
      fetcher.submit({ quantity }, { action: `/cart/order_entries/${id}`, method: 'PATCH' }),
    [fetcher],
  );

  const deleteOrderEntry = useCallback(
    (id: string) => fetcher.submit({}, { action: `/cart/order_entries/${id}`, method: 'DELETE' }),
    [fetcher],
  );

  const changeQuantity = useCallback(
    (orderEntryId: string, newQuantity: number) => {
      if (newQuantity === 0) {
        deleteOrderEntry(orderEntryId);
      } else {
        updateOrderEntry(orderEntryId, newQuantity);
      }
    },
    [deleteOrderEntry, updateOrderEntry],
  );

  const createCouponApplication = useCallback(
    async (couponCode: string) => {
      const orderId = data.convention.my_profile?.current_pending_order?.id;
      if (orderId) {
        fetcher.submit(
          { order_id: orderId, coupon_code: couponCode },
          { action: '/cart/coupon_applications', method: 'POST' },
        );
      }
    },
    [fetcher, data],
  );

  const deleteCouponApplication = useCallback(
    (
      couponApplication: NonNullable<
        NonNullable<CartQueryData['convention']['my_profile']>['current_pending_order']
      >['coupon_applications'][number],
    ) => fetcher.submit(null, { action: `/cart/coupon_applications/${couponApplication.id}`, method: 'DELETE' }),
    [fetcher],
  );

  const removeFromCart = useCallback(
    (entry: OrderEntryType) => {
      let { name } = entry.product;
      if (entry.product_variant) {
        name += ` (${entry.product_variant.name})`;
      }

      confirm({
        prompt: `Are you sure you want to remove ${name} from your cart?`,
        action: () => deleteOrderEntry(entry.id),
        renderError: (e) => <ErrorDisplay graphQLError={e} />,
      });
    },
    [deleteOrderEntry, confirm],
  );

  const checkOutComplete = () => {
    navigate('/order_history');
  };

  const loginRequired = useLoginRequired();

  if (loginRequired) {
    return <></>;
  }

  return (
    <div>
      <h1 className="mb-4">Shopping cart</h1>

      <ErrorDisplay graphQLError={error as ApolloError} />

      <CartContents
        removeFromCart={removeFromCart}
        changeQuantity={(entry: OrderEntryType, quantity: number) => changeQuantity(entry.id, quantity)}
        checkOutButton={
          <button type="button" className="btn btn-primary mt-2" onClick={checkOutModal.open}>
            <i className="bi-cart-fill" /> Check out
          </button>
        }
        createCouponApplication={createCouponApplication}
        deleteCouponApplication={deleteCouponApplication}
      />

      <OrderPaymentModal
        visible={checkOutModal.visible}
        onCancel={checkOutModal.close}
        order={data.convention.my_profile?.current_pending_order ?? undefined}
        onComplete={checkOutComplete}
      />
    </div>
  );
}

export const Component = Cart;
