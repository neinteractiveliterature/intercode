import { useId, useState } from 'react';
import * as React from 'react';
import { ApolloError } from '@apollo/client';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import useAsyncFunction from '../useAsyncFunction';
import { useTranslation } from 'react-i18next';

export type ApplyCouponControlProps = {
  createCouponApplication: (code: string) => Promise<unknown>;
};

function ApplyCouponControl({ createCouponApplication }: ApplyCouponControlProps): React.JSX.Element {
  const { t } = useTranslation();
  const [couponCode, setCouponCode] = useState('');
  const couponCodeInputId = useId();
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
        {t('store.coupons.applyLabel')}
      </label>
      <div className="input-group mb-2">
        <label className="input-group-text" htmlFor={couponCodeInputId}>
          {t('store.coupons.code.label')}
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
          aria-label={t('store.coupons.code.ariaLabel')}
        />
        <button
          className="btn btn-sm btn-outline-primary"
          type="button"
          onClick={applyClicked}
          disabled={applyInProgress}
        >
          {t('buttons.apply')}
        </button>
      </div>
      <ErrorDisplay graphQLError={applyError as ApolloError} />
    </>
  );
}

export default ApplyCouponControl;
