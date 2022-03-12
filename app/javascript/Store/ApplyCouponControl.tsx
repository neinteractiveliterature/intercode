import { useState } from 'react';
import * as React from 'react';
import { ApolloError } from '@apollo/client';
import { ErrorDisplay, useUniqueId } from '@neinteractiveliterature/litform';

import useAsyncFunction from '../useAsyncFunction';

export type ApplyCouponControlProps = {
  createCouponApplication: (code: string) => Promise<unknown>;
};

function ApplyCouponControl({ createCouponApplication }: ApplyCouponControlProps): JSX.Element {
  const [couponCode, setCouponCode] = useState('');
  const couponCodeInputId = useUniqueId('coupon-code-');
  const [applyCoupon, applyError, applyInProgress] = useAsyncFunction(createCouponApplication);

  const applyClicked = async () => {
    await applyCoupon(couponCode);
    setCouponCode('');
  };

  const keyDownInCodeInput = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      applyClicked();
    }
  };

  return (
    <>
      <label className="form-label" htmlFor={couponCodeInputId}>
        Apply coupon
      </label>
      <div className="input-group mb-2">
        <label className="input-group-text" htmlFor={couponCodeInputId}>
          Code:
        </label>
        <input
          type="text"
          className="form-control form-control-sm"
          value={couponCode}
          id={couponCodeInputId}
          onChange={(event) => {
            setCouponCode(event.target.value);
          }}
          onKeyDown={keyDownInCodeInput}
          disabled={applyInProgress}
          aria-label="Coupon code"
        />
        <button
          className="btn btn-sm btn-outline-primary"
          type="button"
          onClick={applyClicked}
          disabled={applyInProgress}
        >
          Apply
        </button>
      </div>
      <ErrorDisplay graphQLError={applyError as ApolloError} />
    </>
  );
}

export default ApplyCouponControl;
