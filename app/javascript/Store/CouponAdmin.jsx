import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { DateTime } from 'luxon';

import { AdminCouponsQuery } from './queries.gql';
import ErrorDisplay from '../ErrorDisplay';
import PageLoadingIndicator from '../PageLoadingIndicator';
import describeCoupon from './describeCoupon';
import pluralizeWithCount from '../pluralizeWithCount';
import AppRootContext from '../AppRootContext';

function CouponAdmin() {
  const { timezoneName } = useContext(AppRootContext);
  const { data, error, loading } = useQuery(AdminCouponsQuery);

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <>
      {data.convention.coupons.map((coupon) => (
        <div className="card">
          <div className="card-header">
            Coupon code
            {' '}
            <code>{coupon.code}</code>
          </div>

          <div className="card-body">
            {describeCoupon(coupon)}
            <br />
            {coupon.usage_limit
              ? `${pluralizeWithCount('use', coupon.usage_limit)}`
              : 'Unlimited uses'}
            <br />
            {coupon.expires_at
              ? `Expires ${DateTime.fromISO(coupon.expires_at).setZone(timezoneName)
                .toLocaleString(DateTime.DATETIME_FULL)}`
              : 'Never expires'}
          </div>
        </div>
      ))}
    </>
  );
}

export default CouponAdmin;
