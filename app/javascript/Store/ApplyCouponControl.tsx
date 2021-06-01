import { useState } from 'react';
import * as React from 'react';
import { ApolloError } from '@apollo/client';
import { ErrorDisplay, useUniqueId } from '@neinteractiveliterature/litform';

import useAsyncFunction from '../useAsyncFunction';

export type ApplyCouponControlProps = {
  createCouponApplication: (code: string) => Promise<any>;
};

function ApplyCouponControl({ createCouponApplication }: ApplyCouponControlProps) {
  const [couponCode, setCouponCode] = useState('');
  const couponCodeInputId = useUniqueId('coupon-code-');
  const [applyCoupon, applyError, applyInProgress] = useAsyncFunction(createCouponApplication);

  const applyClicked = async () => {
    await applyCoupon(couponCode);
    setCouponCode('');
  };

  const keyDownInCodeInput = (event: React.KeyboardEvent) => {
    if (event.keyCode === 13 || event.keyCode === 32) {
      event.preventDefault();
      applyClicked();
    }
  };

  return (
    <>
      <label className="form-label" htmlFor={couponCodeInputId}>
        Apply coupon:
      </label>
      <input
        type="text"
        className="form-control form-control-sm col-4 d-inline-block ms-2"
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
        className="btn btn-sm btn-outline-primary ms-2"
        type="button"
        onClick={applyClicked}
        disabled={applyInProgress}
      >
        Apply
      </button>
      <ErrorDisplay graphQLError={applyError as ApolloError} />
    </>
  );
}

export default ApplyCouponControl;
