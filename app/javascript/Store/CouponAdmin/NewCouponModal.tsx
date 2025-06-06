import { useState } from 'react';
import { Modal } from 'react-bootstrap4-modal';
import { ApolloError } from '@apollo/client';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import CouponForm from './CouponForm';
import buildCouponInput from './buildCouponInput';
import { AdminCouponFieldsFragment } from './queries.generated';
import { CreateCouponDocument } from './mutations.generated';
import { useTranslation } from 'react-i18next';
import { CouponInput } from 'graphqlTypes.generated';
import { ActionFunction, redirect } from 'react-router';
import { client } from 'useIntercodeApolloClient';
import { Link, useFetcher } from 'react-router';

export const action: ActionFunction = async ({ request }) => {
  try {
    if (request.method === 'POST') {
      const coupon = (await request.json()) as CouponInput;
      await client.mutate({ mutation: CreateCouponDocument, variables: { coupon } });
      await client.resetStore();
      return redirect('..');
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
};

function NewCouponModal(): JSX.Element {
  const { t } = useTranslation();
  const [coupon, setCoupon] = useState<Omit<AdminCouponFieldsFragment, 'id'>>({
    __typename: 'Coupon',
    code: '',
    fixed_amount: null,
    percent_discount: null,
    provides_product: null,
    usage_limit: null,
    expires_at: null,
  });
  const fetcher = useFetcher();
  const error = fetcher.data instanceof Error ? fetcher.data : undefined;
  const inProgress = fetcher.state !== 'idle';

  const saveClicked = () => {
    fetcher.submit(buildCouponInput(coupon), { method: 'POST', encType: 'application/json' });
  };

  return (
    <Modal visible dialogClassName="modal-lg">
      <div className="modal-header">{t('admin.store.coupons.newCoupon')}</div>
      <div className="modal-body">
        <CouponForm value={coupon} onChange={setCoupon} />
        <ErrorDisplay graphQLError={error as ApolloError} />
      </div>
      <div className="modal-footer">
        <Link to=".." type="button" className="btn btn-secondary">
          {t('buttons.cancel')}
        </Link>
        <button type="button" className="btn btn-primary" onClick={saveClicked} disabled={inProgress}>
          {t('buttons.create')}
        </button>
      </div>
    </Modal>
  );
}

export const Component = NewCouponModal;
