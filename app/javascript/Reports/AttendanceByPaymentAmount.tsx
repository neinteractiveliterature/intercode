import { LoadQueryWrapper } from '@neinteractiveliterature/litform';
import capitalize from 'lodash/capitalize';

import formatMoney from '../formatMoney';
import usePageTitle from '../usePageTitle';
import { AttendanceByPaymentAmountQueryData, useAttendanceByPaymentAmountQuery } from './queries.generated';
import { Money } from '../graphqlTypes.generated';

type RowType =
  AttendanceByPaymentAmountQueryData['convention']['reports']['ticket_count_by_type_and_payment_amount'][0];

function describeRow(ticketType: RowType['ticket_type'], paymentAmount: RowType['payment_amount']) {
  if (paymentAmount.fractional > 0) {
    return `${ticketType.description} @ ${formatMoney(paymentAmount)}`;
  }

  return ticketType.description;
}

function descriptionCell(ticketType: RowType['ticket_type'], paymentAmount: RowType['payment_amount']) {
  const priceIsPossibleForProduct: (price: Money) => boolean = ticketType.providing_products.reduce(
    (otherwisePossible: (price: Money) => boolean, product) => {
      const value = product.pricing_structure.value;
      if (value.__typename === 'Money') {
        return (price) => otherwisePossible(price) || value.fractional === price.fractional;
      }
      if (value.__typename === 'PayWhatYouWantValue') {
        return (price) =>
          otherwisePossible(price) ||
          ((value.minimum_amount == null || price.fractional >= value.minimum_amount.fractional) &&
            (value.maximum_amount == null || price.fractional <= value.maximum_amount.fractional));
      }

      return (price) =>
        otherwisePossible(price) || value.timespans.some((timespan) => timespan.value.fractional == price.fractional);
    },
    () => false,
  );

  if (priceIsPossibleForProduct(paymentAmount)) {
    return <td>{describeRow(ticketType, paymentAmount)}</td>;
  }

  return (
    <td
      className="text-danger"
      title={`${formatMoney(paymentAmount)} does not appear in the pricing schedule for ${ticketType.description}`}
    >
      <i className="bi-exclamation-circle-fill" /> {describeRow(ticketType, paymentAmount)}
    </td>
  );
}

export default LoadQueryWrapper(useAttendanceByPaymentAmountQuery, function AttendanceByPaymentAmount({ data }) {
  usePageTitle('Attendance by payment amount');

  const sortedRows = [...data.convention.reports.ticket_count_by_type_and_payment_amount].sort((a, b) => {
    if (a.ticket_type.name !== b.ticket_type.name) {
      return a.ticket_type.name.localeCompare(b.ticket_type.name, undefined, {
        sensitivity: 'base',
      });
    }

    return (a.payment_amount.fractional || 0) - (b.payment_amount.fractional || 0);
  });

  return (
    <>
      <h1 className="mb-4">Attendance by payment amount</h1>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>
              {capitalize(data.convention.ticket_name)}
              {' type'}
            </th>
            <th className="text-end">Count</th>
            <th className="text-end">Revenue</th>
          </tr>
        </thead>
        <tbody>
          {sortedRows.map(({ ticket_type: ticketType, payment_amount: paymentAmount, count }) => (
            <tr key={`${ticketType.name}-${paymentAmount.fractional}`}>
              {descriptionCell(ticketType, paymentAmount)}
              <td className="text-end">
                <a
                  href={`/user_con_profiles?columns=name,email,ticket,privileges,payment_amount&filters.ticket=${
                    ticketType.id
                  }&filters.payment_amount=${paymentAmount.fractional / 100}`}
                >
                  {count}
                </a>
              </td>
              <td className="text-end">
                {formatMoney({ ...paymentAmount, fractional: paymentAmount.fractional * count })}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="fw-bold">
            <td colSpan={2} className="text-end">
              Total revenue
            </td>
            <td className="text-end">{formatMoney(data.convention.reports.total_revenue)}</td>
          </tr>
        </tfoot>
      </table>
    </>
  );
});
