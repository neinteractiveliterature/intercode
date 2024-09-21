import { useState, useContext, useEffect } from 'react';
import { ApolloError } from '@apollo/client';
import { Modal } from 'react-bootstrap4-modal';
import { v4 as uuidv4 } from 'uuid';
import { useConfirm, ErrorDisplay } from '@neinteractiveliterature/litform';

import { useTranslation } from 'react-i18next';
import {
  CouponApplication,
  Money,
  OrderEntry,
  OrderInput,
  OrderStatus,
  Product,
  ProductVariant,
  UserConProfile,
} from 'graphqlTypes.generated';
import AppRootContext from 'AppRootContext';
import AdminOrderForm from './AdminOrderForm';
import AdminOrderEntriesTable from './AdminOrderEntriesTable';
import { CreateOrderMutationVariables } from './mutations.generated';
import { useFetcher } from 'react-router-dom';
import { CreateOrderActionInput } from '.';

export type CreatingOrder = Omit<OrderInput, 'payment_amount'> & {
  status: OrderStatus;
  payment_amount: Money;
  order_entries: (Pick<OrderEntry, 'price_per_item' | 'quantity'> & {
    ticket_id: string;
    product: Pick<Product, '__typename' | 'name'> & { id: string };
    product_variant?: Pick<ProductVariant, 'id' | '__typename' | 'name'> | null;
    generatedId: string;
  })[];
  coupon_applications: (Partial<Pick<CouponApplication, 'id' | 'discount'>> & {
    coupon: {
      code: string;
    };
  })[];
  user_con_profile?: Pick<UserConProfile, 'id' | '__typename' | 'name_without_nickname'>;
};

type OrderEntryType = CreatingOrder['order_entries'][0];

function buildBlankOrder(currencyCode: string): CreatingOrder {
  return {
    payment_amount: {
      __typename: 'Money',
      fractional: 0,
      currency_code: currencyCode,
    },
    payment_note: '',
    status: OrderStatus.Paid,
    order_entries: [],
    coupon_applications: [],
  };
}

export type NewOrderModalProps = {
  visible: boolean;
  close: () => void;
  initialOrder?: CreatingOrder;
};

export default function NewOrderModal({ visible, close, initialOrder }: NewOrderModalProps): JSX.Element {
  const { t } = useTranslation();
  const confirm = useConfirm();
  const { defaultCurrencyCode } = useContext(AppRootContext);
  const [order, setOrder] = useState(() => initialOrder || buildBlankOrder(defaultCurrencyCode));
  const fetcher = useFetcher();
  const createOrderError = fetcher.data instanceof Error ? fetcher.data : undefined;
  const createOrderInProgress = fetcher.state !== 'idle';

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data && !createOrderError) {
      close();
    }
  }, [fetcher.state, fetcher.data, createOrderError, close]);

  const createOrder = () => {
    const userConProfile = order.user_con_profile;
    const paymentAmount = order.payment_amount;
    if (!userConProfile || !paymentAmount) {
      return;
    }

    const createOrderVariables: CreateOrderMutationVariables = {
      userConProfileId: userConProfile.id,
      order: {
        payment_amount: {
          currency_code: paymentAmount.currency_code,
          fractional: paymentAmount.fractional,
        },
        payment_note: order.payment_note,
      },
      status: order.status,
      orderEntries: order.order_entries.map((orderEntry) => ({
        productId: orderEntry.product.id,
        productVariantId: orderEntry.product_variant?.id,
        quantity: orderEntry.quantity,
        price_per_item: {
          currency_code: orderEntry.price_per_item.currency_code,
          fractional: orderEntry.price_per_item.fractional,
        },
        ticketId: orderEntry.ticket_id,
      })),
    };

    fetcher.submit(
      {
        createOrderVariables,
        couponCodes: order.coupon_applications.map((app) => app.coupon.code),
      } satisfies CreateOrderActionInput,
      { action: '/admin_store/orders', method: 'POST', encType: 'application/json' },
    );
  };

  const updateOrder = (attributes: Partial<CreatingOrder>) =>
    setOrder((prevOrder) => ({ ...prevOrder, ...attributes }));

  const createOrderEntry = async (orderEntry: OrderEntryType) =>
    setOrder((prevOrder) => ({
      ...prevOrder,
      order_entries: [...prevOrder.order_entries, { ...orderEntry, generatedId: uuidv4() }],
    }));

  const updateOrderEntry = async (orderEntry: OrderEntryType, attributes: Partial<OrderEntryType>) =>
    setOrder((prevOrder) => ({
      ...prevOrder,
      order_entries: prevOrder.order_entries.map((entry) => {
        if (entry.generatedId === orderEntry.generatedId) {
          return { ...entry, ...attributes };
        }

        return entry;
      }),
    }));

  const deleteOrderEntry = async (orderEntry: OrderEntryType) =>
    setOrder((prevOrder) => ({
      ...prevOrder,
      order_entries: prevOrder.order_entries.filter((entry) => entry.generatedId !== orderEntry.generatedId),
    }));

  const createCouponApplication = async (couponCode: string) =>
    setOrder((prevOrder) => ({
      ...prevOrder,
      coupon_applications: [...prevOrder.coupon_applications, { coupon: { code: couponCode } }],
    }));

  const deleteCouponApplication = async (couponApplication: CreatingOrder['coupon_applications'][0]) =>
    setOrder((prevOrder) => ({
      ...prevOrder,
      coupon_applications: prevOrder.coupon_applications.filter(
        (application) => application.coupon.code !== couponApplication.coupon.code,
      ),
    }));

  return (
    <Modal visible={visible && !confirm.visible} dialogClassName="modal-lg">
      <div className="modal-header">{t('store.newOrder.header')}</div>
      <div className="modal-body">
        <AdminOrderForm order={order} updateOrder={updateOrder} />

        <section className="mt-4">
          <AdminOrderEntriesTable
            order={order}
            createOrderEntry={createOrderEntry}
            updateOrderEntry={updateOrderEntry}
            deleteOrderEntry={deleteOrderEntry}
            createCouponApplication={createCouponApplication}
            deleteCouponApplication={deleteCouponApplication}
            createError={undefined}
            createInProgress={false}
          />
        </section>

        <ErrorDisplay graphQLError={createOrderError as ApolloError} />
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={close} disabled={createOrderInProgress}>
          {t('buttons.cancel')}
        </button>
        <button type="button" className="btn btn-primary" onClick={createOrder} disabled={createOrderInProgress}>
          {t('buttons.create')}
        </button>
      </div>
    </Modal>
  );
}
