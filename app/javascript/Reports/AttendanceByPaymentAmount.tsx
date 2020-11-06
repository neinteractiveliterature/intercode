// @ts-expect-error
import { capitalize } from 'inflected';
import isEqual from 'lodash/isEqual';

import formatMoney from '../formatMoney';
import usePageTitle from '../usePageTitle';
import { LoadQueryWrapper } from '../GraphqlLoadingWrappers';
import {
  AttendanceByPaymentAmountQueryQuery,
  useAttendanceByPaymentAmountQueryQuery,
} from './queries.generated';

type RowType = AttendanceByPaymentAmountQueryQuery['convention']['reports']['ticket_count_by_type_and_payment_amount'][0];

function describeRow(ticketType: RowType['ticket_type'], paymentAmount: RowType['payment_amount']) {
  if (paymentAmount.fractional > 0) {
    return `${ticketType.description} @ ${formatMoney(paymentAmount)}`;
  }

  return ticketType.description;
}

function descriptionCell(
  ticketType: RowType['ticket_type'],
  paymentAmount: RowType['payment_amount'],
) {
  if (
    ticketType.pricing_schedule.timespans.some((timespan) => isEqual(timespan.value, paymentAmount))
  ) {
    return <td>{describeRow(ticketType, paymentAmount)}</td>;
  }

  return (
    <td
      className="text-danger"
      title={`${formatMoney(paymentAmount)} does not appear in the pricing schedule for ${
        ticketType.description
      }`}
    >
      <i className="fa fa-exclamation-circle" /> {describeRow(ticketType, paymentAmount)}
    </td>
  );
}

export default LoadQueryWrapper(
  useAttendanceByPaymentAmountQueryQuery,
  function AttendanceByPaymentAmount({ data }) {
    usePageTitle('Attendance by payment amount');

    const sortedRows = [...data.convention.reports.ticket_count_by_type_and_payment_amount].sort(
      (a, b) => {
        if (a.ticket_type.name !== b.ticket_type.name) {
          return a.ticket_type.name.localeCompare(b.ticket_type.name, undefined, {
            sensitivity: 'base',
          });
        }

        return (a.payment_amount.fractional || 0) - (b.payment_amount.fractional || 0);
      },
    );

    return (
      <>
        <h1 className="mb-4">Attendance by payment amount</h1>

        <table className="table table-striped">
          <thead>
            <tr>
              .{' '}
              <th>
                {capitalize(data.convention.ticket_name)}
                {' type'}
              </th>
              <th className="text-right">Count</th>
              <th className="text-right">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {sortedRows.map(({ ticket_type: ticketType, payment_amount: paymentAmount, count }) => (
              <tr key={`${ticketType.name}-${paymentAmount.fractional}`}>
                {descriptionCell(ticketType, paymentAmount)}
                <td className="text-right">
                  <a
                    href={`/user_con_profiles?columns=name,email,ticket,privileges,payment_amount&filters.ticket=${
                      ticketType.id
                    }&filters.payment_amount=${paymentAmount.fractional / 100}`}
                  >
                    {count}
                  </a>
                </td>
                <td className="text-right">
                  {formatMoney({ ...paymentAmount, fractional: paymentAmount.fractional * count })}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-weight-bold">
              <td colSpan={2} className="text-right">
                Total revenue
              </td>
              <td className="text-right">{formatMoney(data.convention.reports.total_revenue)}</td>
            </tr>
          </tfoot>
        </table>
      </>
    );
  },
);
