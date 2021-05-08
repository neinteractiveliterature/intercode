import * as React from 'react';

import ErrorDisplay from '../ErrorDisplay';
import InPlaceEditor from '../BuiltInFormControls/InPlaceEditor';
import formatMoney from '../formatMoney';
import describeCoupon from './describeCoupon';
import { useConfirm } from '../ModalDialogs/Confirm';
import ApplyCouponControl from './ApplyCouponControl';
import { LoadQueryWrapper } from '../GraphqlLoadingWrappers';
import { CartQueryData, useCartQuery } from './queries.generated';
import { parseIntOrNull } from '../ValueUtils';

type OrderType = NonNullable<CartQueryData['currentPendingOrder']>;
type OrderEntryType = OrderType['order_entries'][0];

export type CartContentsProps = {
  removeFromCart?: (entry: OrderEntryType) => void;
  createCouponApplication?: (code: string) => Promise<any>;
  deleteCouponApplication?: (application: OrderType['coupon_applications'][0]) => Promise<any>;
  changeQuantity?: (entry: OrderEntryType, quantity: number) => Promise<any>;
  checkOutButton?: React.ReactNode;
};

export default LoadQueryWrapper<CartQueryData, CartContentsProps>(
  useCartQuery,
  function CartContents({
    data,
    removeFromCart,
    createCouponApplication,
    deleteCouponApplication,
    changeQuantity,
    checkOutButton,
  }) {
    const confirm = useConfirm();

    if (!data.currentPendingOrder || data.currentPendingOrder.order_entries.length === 0) {
      return <>Your cart is empty.</>;
    }

    const rows = data.currentPendingOrder.order_entries.map((entry) => (
      <tr key={entry.id}>
        <td>
          {entry.product.name}
          {entry.product_variant ? ` (${entry.product_variant.name})` : null}
        </td>
        <td>
          {changeQuantity && !entry.product.provides_ticket_type ? (
            <InPlaceEditor
              value={entry.quantity.toString()}
              onChange={(newValue) => {
                const newValueNumber = parseIntOrNull(newValue);
                if (newValueNumber != null) {
                  changeQuantity(entry, newValueNumber);
                }
              }}
            />
          ) : (
            entry.quantity
          )}
        </td>
        <td>{formatMoney(entry.price)}</td>
        <td>
          {removeFromCart && (
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => {
                removeFromCart(entry);
              }}
            >
              <i className="fa fa-trash-o" />
              <span className="sr-only">Remove from cart</span>
            </button>
          )}
        </td>
      </tr>
    ));

    return (
      <div className="mb-2">
        <table className="table mb-0">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th />
            </tr>
          </thead>
          <tbody>{rows}</tbody>
          <tfoot>
            {data.currentPendingOrder.coupon_applications.length > 0 && (
              <>
                <tr className="bg-light">
                  <td colSpan={2}>
                    <em>Total before coupons</em>
                  </td>
                  <td colSpan={2}>
                    <em>{formatMoney(data.currentPendingOrder.total_price_before_discounts)}</em>
                  </td>
                </tr>
                {data.currentPendingOrder.coupon_applications.map((app) => (
                  <tr key={app.id} className="bg-light">
                    <td colSpan={2}>
                      Coupon code: <code>{app.coupon.code}</code>
                      <br />
                      <small>{describeCoupon(app.coupon)}</small>
                    </td>
                    <td className="text-danger">-{formatMoney(app.discount)}</td>
                    <td>
                      {deleteCouponApplication && (
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() =>
                            confirm({
                              prompt: 'Are you sure you want to remove this coupon?',
                              action: () => deleteCouponApplication(app),
                              renderError: (err) => <ErrorDisplay graphQLError={err} />,
                            })
                          }
                        >
                          <i className="fa fa-trash-o" />
                          <span className="sr-only">Remove from cart</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </>
            )}
            {createCouponApplication && (
              <tr className="bg-light">
                <td colSpan={4}>
                  <ApplyCouponControl createCouponApplication={createCouponApplication} />
                </td>
              </tr>
            )}
            <tr className="bg-warning-light">
              <td colSpan={2}>
                <strong>
                  {data.currentPendingOrder.coupon_applications.length > 0
                    ? 'Grand total'
                    : 'Total'}
                </strong>
              </td>
              <td colSpan={2}>
                <strong>{formatMoney(data.currentPendingOrder.total_price)}</strong>
              </td>
            </tr>
          </tfoot>
        </table>
        {checkOutButton && <div className="text-end">{checkOutButton}</div>}
      </div>
    );
  },
);
