import { useMemo } from 'react';
import * as React from 'react';
import classNames from 'classnames';
import { useConfirm, ErrorDisplay, ChoiceSet } from '@neinteractiveliterature/litform';

import InPlaceEditor from 'BuiltInFormControls/InPlaceEditor';
import InPlaceMoneyEditor from 'Store/InPlaceMoneyEditor';
import UserConProfileSelect from 'BuiltInFormControls/UserConProfileSelect';
import EnumTypes from 'enumTypes.json';
import { Order, OrderStatus, UserConProfile } from 'graphqlTypes.generated';
import { Trans, useTranslation } from 'react-i18next';
import { useFetcher } from 'react-router-dom';

const ORDER_STATUS_CHOICES = EnumTypes.OrderStatus.enumValues
  .map((enumValue) => ({ label: enumValue.name, value: enumValue.name }))
  .filter((choice) => choice.value !== 'pending');

export type AdminOrderType = Pick<Order, 'status' | 'charge_id' | 'paid_at' | 'payment_amount' | 'payment_note'> & {
  user_con_profile?: Pick<UserConProfile, 'id' | '__typename' | 'name_without_nickname'>;
};

export type AdminOrderTypeWithId = AdminOrderType & { id: string };

export function adminOrderHasId(order: AdminOrderType | AdminOrderTypeWithId): order is AdminOrderTypeWithId {
  return 'id' in order && order.id != null;
}

type CancelOrderButtonProps = {
  order: AdminOrderTypeWithId;
  skipRefund: boolean;
};

enum CancelMode {
  Refund = 'refund',
  NoRefund = 'noRefund',
  NoCharge = 'noCharge',
  Free = 'free',
}

function CancelOrderButton({ order, skipRefund }: CancelOrderButtonProps) {
  const { t } = useTranslation();
  const confirm = useConfirm();
  const fetcher = useFetcher();

  const mode = useMemo(() => {
    if (order.charge_id && !skipRefund) {
      return CancelMode.Refund;
    } else if (order.status === OrderStatus.Paid) {
      if (order.charge_id) {
        return CancelMode.NoRefund;
      } else {
        return CancelMode.NoCharge;
      }
    } else {
      return CancelMode.Free;
    }
  }, [order.charge_id, order.status, skipRefund]);

  return (
    <button
      type="button"
      className={classNames('btn btn-sm me-1', skipRefund ? 'btn-danger' : 'btn-warning')}
      onClick={() =>
        confirm({
          prompt: (
            <Trans
              i18nKey={`admin.store.cancelOrder.${mode}.prompt`}
              values={{ orderId: order.id, name: order.user_con_profile?.name_without_nickname }}
              components={{
                danger: <div className="alert alert-danger mb-0" />,
                warning: <div className="alert alert-warning mb-0" />,
              }}
            />
          ),
          action: () =>
            fetcher.submit(
              { skip_refund: skipRefund },
              { action: `/admin_store/orders/${order.id}/cancel`, method: 'PATCH' },
            ),
          renderError: (error) => <ErrorDisplay graphQLError={error} />,
        })
      }
    >
      {t(`admin.store.cancelOrder.${mode}.button`)}
    </button>
  );
}

type OrderActionsProps = {
  order: AdminOrderTypeWithId;
};

function OrderActions({ order }: OrderActionsProps) {
  const { t } = useTranslation();
  const confirm = useConfirm();
  const fetcher = useFetcher();

  const buttons = [];

  if (order.status === 'unpaid') {
    buttons.push(
      <button
        type="button"
        className="btn btn-sm btn-outline-danger me-1"
        onClick={() =>
          confirm({
            prompt: t('admin.store.markAsPaid.prompt', { orderId: order.id }),
            action: () =>
              fetcher.submit(null, { action: `/admin_store/orders/${order.id}/mark_paid`, method: 'PATCH' }),
            renderError: (error) => <ErrorDisplay graphQLError={error} />,
          })
        }
        key="markAsPaid"
      >
        {t('admin.store.markAsPaid.button')}
      </button>,
    );
  }

  if (order.status === 'unpaid' || order.status === 'paid') {
    buttons.push(<CancelOrderButton order={order} key="cancel" skipRefund={false} />);

    if (order.charge_id) {
      buttons.push(<CancelOrderButton order={order} skipRefund key="cancelWithoutRefund" />);
    }
  }

  return <>{buttons}</>;
}

export type AdminOrderFormProps<T extends AdminOrderType> = {
  order: T;
  updateOrder: React.Dispatch<Partial<T>>;
};

function AdminOrderForm<T extends AdminOrderType>({ order, updateOrder }: AdminOrderFormProps<T>): JSX.Element {
  const { t } = useTranslation();

  return (
    <div>
      <dl className="row m-0">
        <dt className="col-md-3">{t('admin.store.orders.customerName')}</dt>
        <dd className="col-md-9">
          {adminOrderHasId(order) ? (
            order.user_con_profile?.name_without_nickname
          ) : (
            <UserConProfileSelect
              value={order.user_con_profile}
              onChange={(value) => updateOrder({ user_con_profile: value } as Partial<T>)}
            />
          )}
        </dd>

        <dt className="col-md-3">{t('admin.store.orders.paymentAmount')}</dt>
        <dd className="col-md-9">
          <InPlaceMoneyEditor
            value={order.payment_amount}
            onChange={(value) => updateOrder({ payment_amount: value } as Partial<T>)}
          />
        </dd>

        <dt className="col-md-3">{t('admin.store.orders.status')}</dt>
        <dd className="col-md-9">
          {adminOrderHasId(order) ? (
            <ul className="list-inline m-0">
              <li className="list-inline-item">
                {t(`admin.store.orders.statusDescription.${order.status}`, { paidAt: order.paid_at })}
              </li>
              <li className="list-inline-item">
                <OrderActions order={order} />
              </li>
            </ul>
          ) : (
            <ChoiceSet
              choices={ORDER_STATUS_CHOICES}
              value={order.status}
              onChange={(status: OrderStatus) => updateOrder({ status } as Partial<T>)}
              choiceClassName="form-check-inline"
            />
          )}
        </dd>

        <dt className="col-md-3">{t('admin.store.orders.paymentNote')}</dt>
        <dd className="col-md-9">
          <InPlaceEditor
            value={order.payment_note || ''}
            renderInput={({ buttons, inputProps: { onChange, ...inputProps } }) => (
              <>
                <textarea
                  className="form-control col me-1"
                  onChange={(event) => {
                    onChange(event.target.value);
                  }}
                  {...inputProps}
                />
                {buttons}
              </>
            )}
            onChange={(value) => updateOrder({ payment_note: value } as Partial<T>)}
          />
        </dd>
      </dl>
    </div>
  );
}

export default AdminOrderForm;
