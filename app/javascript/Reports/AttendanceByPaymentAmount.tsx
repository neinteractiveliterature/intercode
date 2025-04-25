import capitalize from 'lodash/capitalize';

import formatMoney from '../formatMoney';
import usePageTitle from '../usePageTitle';
import { AttendanceByPaymentAmountQueryData, AttendanceByPaymentAmountQueryDocument } from './queries.generated';
import { Money, Product } from '../graphqlTypes.generated';
import assertNever from 'assert-never';
import { Route } from './+types/AttendanceByPaymentAmount';
import { apolloClientContext } from 'AppContexts';

type RowType =
  AttendanceByPaymentAmountQueryData['convention']['reports']['sales_count_by_product_and_payment_amount'][number];
type ProvidesTicketType = NonNullable<RowType['product']['provides_ticket_type']>;

function priceIsPossibleForProduct(price: Money, product: Pick<Product, 'pricing_structure'>) {
  const value = product.pricing_structure.value;
  if (value.__typename === 'Money') {
    return value.fractional === price.fractional;
  } else if (value.__typename === 'PayWhatYouWantValue') {
    return (
      (value.minimum_amount == null || price.fractional >= value.minimum_amount.fractional) &&
      (value.maximum_amount == null || price.fractional <= value.maximum_amount.fractional)
    );
  } else if (value.__typename === 'ScheduledMoneyValue') {
    return value.timespans.some((timespan) => timespan.value.fractional == price.fractional);
  } else {
    assertNever(value, false);
    return false;
  }
}

function describeRow(
  ticketType: ProvidesTicketType | null | undefined,
  productName: string,
  paymentAmount: RowType['payment_amount'],
) {
  if (paymentAmount.fractional > 0) {
    return `${ticketType?.description ?? productName} @ ${formatMoney(paymentAmount)}`;
  }

  return ticketType?.description ?? productName;
}

function descriptionCell(
  ticketType: ProvidesTicketType | null | undefined,
  productName: string,
  paymentAmount: RowType['payment_amount'],
) {
  const priceIsPossibleForAnyProduct =
    ticketType?.providing_products.some((product) => priceIsPossibleForProduct(paymentAmount, product)) ?? true;

  if (priceIsPossibleForAnyProduct) {
    return <td>{describeRow(ticketType, productName, paymentAmount)}</td>;
  }

  return (
    <td
      className="text-danger"
      title={`${formatMoney(paymentAmount)} does not appear in the pricing schedule for ${ticketType?.description ?? productName}`}
    >
      <i className="bi-exclamation-circle-fill" /> {describeRow(ticketType, productName, paymentAmount)}
    </td>
  );
}

export async function loader({ context }: Route.LoaderArgs) {
  const { data } = await context.get(apolloClientContext).query({
    query: AttendanceByPaymentAmountQueryDocument,
  });
  return data;
}

function AttendanceByPaymentAmount({ loaderData: data }: Route.ComponentProps) {
  usePageTitle('Attendance by payment amount');

  const sortedRows = [...data.convention.reports.sales_count_by_product_and_payment_amount].sort((a, b) => {
    if (
      a.product.provides_ticket_type &&
      b.product.provides_ticket_type &&
      a.product.provides_ticket_type.name !== b.product.provides_ticket_type.name
    ) {
      return a.product.provides_ticket_type.name.localeCompare(b.product.provides_ticket_type?.name ?? '', undefined, {
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
          {sortedRows.map(
            ({
              product: { name: productName, provides_ticket_type: ticketType },
              payment_amount: paymentAmount,
              count,
            }) => (
              <tr key={`${ticketType?.name ?? productName}-${paymentAmount.fractional}`}>
                {descriptionCell(ticketType, productName, paymentAmount)}
                <td className="text-end">
                  {ticketType ? (
                    <a
                      href={`/user_con_profiles?columns=name,email,ticket,privileges,payment_amount&filters.ticket=${
                        ticketType.id
                      }&filters.payment_amount=${paymentAmount.fractional / 100}`}
                    >
                      {count}
                    </a>
                  ) : (
                    count
                  )}
                </td>
                <td className="text-end">
                  {formatMoney({ ...paymentAmount, fractional: paymentAmount.fractional * count })}
                </td>
              </tr>
            ),
          )}
        </tbody>
        <tfoot>
          <tr className="fw-bold">
            <td colSpan={2} className="text-end">
              Total revenue
            </td>
            <td className="text-end">{formatMoney(data.convention.reports.sum_revenue)}</td>
          </tr>
        </tfoot>
      </table>
    </>
  );
}

export default AttendanceByPaymentAmount;
