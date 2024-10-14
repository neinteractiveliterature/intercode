import { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap4-modal';
import { ApolloError } from '@apollo/client';
import { useGraphQLConfirm, ErrorDisplay } from '@neinteractiveliterature/litform';

import CouponForm from './CouponForm';
import buildCouponInput from './buildCouponInput';
import {
  AdminCouponFieldsFragment,
  AdminSingleCouponQueryData,
  AdminSingleCouponQueryDocument,
} from './queries.generated';
import { useTranslation } from 'react-i18next';
import { ActionFunction, LoaderFunction, redirect, useLoaderData } from 'react-router';
import { client } from 'useIntercodeApolloClient';
import { Link, useFetcher } from 'react-router';
import { DeleteCouponDocument, UpdateCouponDocument } from './mutations.generated';
import { CouponInput } from 'graphqlTypes.generated';

export const action: ActionFunction = async ({ params: { id }, request }) => {
  try {
    if (request.method === 'DELETE') {
      await client.mutate({ mutation: DeleteCouponDocument, variables: { id } });
      await client.resetStore();
      return redirect('..');
    } else if (request.method === 'PATCH') {
      const coupon = (await request.json()) as CouponInput;
      await client.mutate({ mutation: UpdateCouponDocument, variables: { id, coupon } });
      await client.resetStore();
      return redirect('..');
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
};

export const loader: LoaderFunction = async ({ params: { id } }) => {
  const { data } = await client.query({
    query: AdminSingleCouponQueryDocument,
    variables: { id },
  });
  return data.convention.coupon;
};

function EditCouponModal(): JSX.Element {
  const initialCoupon = useLoaderData() as AdminSingleCouponQueryData['convention']['coupon'];
  const { t } = useTranslation();
  const confirm = useGraphQLConfirm();
  const [coupon, setCoupon] = useState(initialCoupon);
  const fetcher = useFetcher();
  const error = fetcher.data instanceof Error ? fetcher.data : undefined;
  const inProgress = fetcher.state !== 'idle';

  useEffect(() => {
    setCoupon(initialCoupon);
  }, [initialCoupon]);

  const saveClicked = () => {
    fetcher.submit(buildCouponInput(coupon), { method: 'PATCH', encType: 'application/json' });
  };

  const deleteConfirmed = () => {
    fetcher.submit({}, { method: 'DELETE' });
  };

  return (
    <Modal visible={!confirm.visible} dialogClassName="modal-lg">
      <div className="modal-header">
        <div className="flex-grow-1">{t('admin.store.coupons.editCoupon')}</div>
        <div>
          <button
            className="btn btn-outline-danger btn-sm"
            type="button"
            onClick={() =>
              confirm({
                action: deleteConfirmed,
                prompt: t('admin.store.coupons.deletePrompt'),
              })
            }
          >
            <i className="bi-trash" /> {t('admin.store.coupons.deleteCoupon')}
          </button>
        </div>
      </div>
      <div className="modal-body">
        {coupon && <CouponForm<AdminCouponFieldsFragment> value={coupon} onChange={setCoupon} />}
        <ErrorDisplay graphQLError={error as ApolloError} />
      </div>
      <div className="modal-footer">
        <Link to=".." type="button" className="btn btn-secondary">
          {t('buttons.cancel')}
        </Link>
        <button type="button" className="btn btn-primary" onClick={saveClicked} disabled={inProgress}>
          {t('buttons.save')}
        </button>
      </div>
    </Modal>
  );
}

export const Component = EditCouponModal;
