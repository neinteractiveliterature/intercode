import { useContext } from 'react';
import * as React from 'react';
import { humanize } from 'inflected';
import classNames from 'classnames';
import { DateTime } from 'luxon';
import { useConfirm, ErrorDisplay, ChoiceSet } from '@neinteractiveliterature/litform';

import InPlaceEditor from '../BuiltInFormControls/InPlaceEditor';
import AppRootContext from '../AppRootContext';
import InPlaceMoneyEditor from './InPlaceMoneyEditor';
import UserConProfileSelect from '../BuiltInFormControls/UserConProfileSelect';
import EnumTypes from '../enumTypes.json';
import { Order, OrderStatus, UserConProfile } from '../graphqlTypes.generated';
import { useCancelOrderMutation, useMarkOrderPaidMutation } from './mutations.generated';
import { useAppDateTimeFormat } from '../TimeUtils';

const ORDER_STATUS_CHOICES = EnumTypes.OrderStatus.enumValues
  .map((enumValue) => ({ label: enumValue.name, value: enumValue.name }))
  .filter((choice) => choice.value !== 'pending');

export type AdminOrderType = Pick<
  Order,
  'status' | 'charge_id' | 'paid_at' | 'payment_amount' | 'payment_note'
> & {
  user_con_profile?: Pick<UserConProfile, 'name_without_nickname'>;
};

export type AdminOrderTypeWithId = AdminOrderType & { id: number };

export function adminOrderHasId(
  order: AdminOrderType | AdminOrderTypeWithId,
): order is AdminOrderTypeWithId {
  return 'id' in order && order.id != null;
}

type CancelOrderButtonProps = {
  order: AdminOrderTypeWithId;
  skipRefund: boolean;
};

function CancelOrderButton({ order, skipRefund }: CancelOrderButtonProps) {
  const [cancelOrder] = useCancelOrderMutation();
  const confirm = useConfirm();
  let prompt: React.ReactNode;
  let buttonCaption: string;

  if (order.charge_id && !skipRefund) {
    prompt = (
      <div>
        <p>Are you sure you want to cancel order #{order.id}?</p>
        <p>
          This will issue a refund back to {order.user_con_profile?.name_without_nickname}
          &apos;s payment card.
        </p>
      </div>
    );
    buttonCaption = 'Cancel and refund';
  } else if (order.status === 'paid') {
    prompt = (
      <div>
        <p>Are you sure you want to cancel order #{order.id}?</p>
        {order.charge_id ? (
          <div className="alert alert-danger mb-0">
            This will not issue a refund. Please make sure this is what you want to do. If you would
            rather issue a refund, cancel this and select “Cancel and refund” instead.
          </div>
        ) : (
          <div className="alert alert-warning mb-0">
            Because there is no Stripe charge associated with this order,{' '}
            {order.user_con_profile?.name_without_nickname} will not automatically receive a refund,
            so they will have to be refunded manually.
          </div>
        )}
      </div>
    );
    buttonCaption = 'Cancel without refund';
  } else {
    prompt = (
      <div>
        <p>Are you sure you want to cancel order #{order.id}?</p>
      </div>
    );
    buttonCaption = 'Cancel';
  }

  return (
    <button
      type="button"
      className={classNames('btn btn-sm me-1', skipRefund ? 'btn-danger' : 'btn-warning')}
      onClick={() =>
        confirm({
          prompt,
          action: () => cancelOrder({ variables: { orderId: order.id, skipRefund } }),
          renderError: (error) => <ErrorDisplay graphQLError={error} />,
        })
      }
    >
      {buttonCaption}
    </button>
  );
}

type OrderActionsProps = {
  order: AdminOrderTypeWithId;
};

function OrderActions({ order }: OrderActionsProps) {
  const confirm = useConfirm();
  const [markOrderPaid] = useMarkOrderPaidMutation();

  const buttons = [];

  if (order.status === 'unpaid') {
    buttons.push(
      <button
        type="button"
        className="btn btn-sm btn-outline-danger me-1"
        onClick={() =>
          confirm({
            prompt: `Are you sure you want to mark order #${order.id} as paid?`,
            action: () => markOrderPaid({ variables: { orderId: order.id } }),
            renderError: (error) => <ErrorDisplay graphQLError={error} />,
          })
        }
        key="markAsPaid"
      >
        Mark as paid
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

function AdminOrderForm<T extends AdminOrderType>({
  order,
  updateOrder,
}: AdminOrderFormProps<T>): JSX.Element {
  const { timezoneName } = useContext(AppRootContext);
  const format = useAppDateTimeFormat();

  return (
    <div>
      <dl className="row m-0">
        <dt className="col-md-3">Customer name</dt>
        <dd className="col-md-9">
          {adminOrderHasId(order) ? (
            order.user_con_profile?.name_without_nickname
          ) : (
            <UserConProfileSelect
              value={order.user_con_profile}
              onChange={(value: T['user_con_profile']) =>
                updateOrder({ user_con_profile: value } as Partial<T>)
              }
            />
          )}
        </dd>

        <dt className="col-md-3">Payment amount</dt>
        <dd className="col-md-9">
          <InPlaceMoneyEditor
            value={order.payment_amount}
            onChange={(value) => updateOrder({ payment_amount: value } as Partial<T>)}
          />
        </dd>

        <dt className="col-md-3">Order status</dt>
        <dd className="col-md-9">
          {adminOrderHasId(order) ? (
            <ul className="list-inline m-0">
              <li className="list-inline-item">
                {humanize(order.status)}
                {order.paid_at
                  ? `on ${format(
                      DateTime.fromISO(order.paid_at, { zone: timezoneName }),
                      'shortWeekdayDateTime',
                    )}`
                  : null}
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

        <dt className="col-md-3">Payment note</dt>
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
