import { MockLink } from '@apollo/client/testing';
import { Outlet, useLocation } from 'react-router';
import { vi } from 'vitest';

import { renderRoute, userEvent, waitFor } from '../testUtils';
import runAction from '../runAction';
import {
  action as editAction,
  Component as EditCouponModal,
  loader as editLoader,
} from '../../../app/javascript/Store/CouponAdmin/EditCouponModal';
import {
  action as newAction,
  Component as NewCouponModal,
} from '../../../app/javascript/Store/CouponAdmin/NewCouponModal';
import {
  CreateCouponDocument,
  DeleteCouponDocument,
  UpdateCouponDocument,
  UpdateCouponMutationData,
} from '../../../app/javascript/Store/CouponAdmin/mutations.generated';
import {
  AdminSingleCouponQueryData,
  AdminSingleCouponQueryDocument,
} from '../../../app/javascript/Store/CouponAdmin/queries.generated';
import { buildMoney } from '../fixtures/store';

// The product picker has its own tests; the coupon form needs it only for coupons that provide a product.
vi.mock('../../../app/javascript/BuiltInFormControls/ProductSelect', () => ({ default: () => <div /> }));

type Coupon = AdminSingleCouponQueryData['convention']['coupon'];

// In the app the coupon modals are children of the coupon list, which they return to (`..`) when they're done, so
// they're rendered inside a stand-in list that shows where we are
function CouponListStandIn() {
  const { pathname } = useLocation();

  return (
    <>
      <h1>Coupon list</h1>
      <p data-testid="location">{pathname}</p>
      <Outlet />
    </>
  );
}

const coupon: Coupon = {
  __typename: 'Coupon',
  id: '3',
  code: 'SAVE5',
  fixed_amount: buildMoney(500),
  percent_discount: null,
  provides_product: null,
  usage_limit: 10,
  expires_at: null,
};

describe('the coupon admin routes', () => {
  let user: ReturnType<typeof userEvent.setup>;
  const sent = vi.fn();

  beforeEach(() => {
    user = userEvent.setup();
    sent.mockReset();
  });

  const recordingMock = (
    query: MockLink.MockedResponse['request']['query'],
    data: Record<string, unknown>,
  ): MockLink.MockedResponse => ({
    request: {
      query,
      variables: (variables: unknown) => {
        sent(variables);
        return true;
      },
    },
    result: { data },
  });

  const couponPayload = (field: 'createCoupon' | 'updateCoupon') => ({
    __typename: 'Mutation',
    [field]: { __typename: field === 'createCoupon' ? 'CreateCouponPayload' : 'UpdateCouponPayload', coupon },
  });
  const deletePayload = {
    __typename: 'Mutation',
    deleteCoupon: { __typename: 'DeleteCouponPayload', clientMutationId: null },
  };
  const singleCouponQuery: MockLink.MockedResponse<AdminSingleCouponQueryData> = {
    request: { query: AdminSingleCouponQueryDocument, variables: { id: '3' } },
    result: { data: { __typename: 'Query', convention: { __typename: 'Convention', id: '1', coupon } } },
  };

  const isRedirectTo = (result: unknown, location: string) =>
    result instanceof Response && result.status === 302 && result.headers.get('Location') === location;

  describe('the actions', () => {
    it('creates a coupon from the JSON input, resets the store, and goes back to the list', async () => {
      const input = { code: 'SAVE5', fixed_amount: { fractional: 500, currency_code: 'USD' } };
      const { result, resetStore } = await runAction(newAction, {
        method: 'POST',
        json: input,
        apolloMocks: [recordingMock(CreateCouponDocument, couponPayload('createCoupon'))],
      });

      expect(sent).toHaveBeenCalledWith({ coupon: input });
      expect(resetStore).toHaveBeenCalledTimes(1);
      expect(isRedirectTo(result, '..')).toBe(true);
    });

    it('returns the error if the coupon can’t be created', async () => {
      const { result } = await runAction(newAction, {
        method: 'POST',
        json: { code: 'SAVE5' },
        apolloMocks: [
          {
            request: { query: CreateCouponDocument, variables: { coupon: { code: 'SAVE5' } } },
            result: { errors: [{ message: 'Code has already been taken' }] },
          },
        ],
      });

      expect((result as Error).message).toContain('Code has already been taken');
    });

    it('does nothing for any other method when creating', async () => {
      const { result } = await runAction(newAction, { method: 'PATCH', json: {} });

      expect((result as Response).status).toBe(404);
    });

    it('updates the coupon named in the URL, then goes back to the list', async () => {
      const { result, resetStore } = await runAction(editAction, {
        method: 'PATCH',
        params: { id: '3' },
        json: { code: 'SAVE10' },
        apolloMocks: [recordingMock(UpdateCouponDocument, couponPayload('updateCoupon'))],
      });

      expect(sent).toHaveBeenCalledWith({ id: '3', coupon: { code: 'SAVE10' } });
      expect(resetStore).toHaveBeenCalledTimes(1);
      expect(isRedirectTo(result, '..')).toBe(true);
    });

    it('deletes the coupon named in the URL, then goes back to the list', async () => {
      const { result, resetStore } = await runAction(editAction, {
        method: 'DELETE',
        params: { id: '3' },
        apolloMocks: [recordingMock(DeleteCouponDocument, deletePayload)],
      });

      expect(sent).toHaveBeenCalledWith({ id: '3' });
      expect(resetStore).toHaveBeenCalledTimes(1);
      expect(isRedirectTo(result, '..')).toBe(true);
    });

    it('does nothing for any other method when editing', async () => {
      const { result } = await runAction(editAction, { method: 'POST', params: { id: '3' } });

      expect((result as Response).status).toBe(404);
    });
  });

  describe('NewCouponModal', () => {
    const renderNew = (apolloMocks: MockLink.MockedResponse[] = []) =>
      renderRoute(
        [
          {
            path: '/coupons',
            Component: CouponListStandIn,
            children: [{ path: 'new', action: newAction, Component: NewCouponModal }],
          },
        ],
        {
          apolloMocks,
          initialEntries: ['/coupons/new'],
          appRootContextValue: { defaultCurrencyCode: 'USD', supportedCurrencyCodes: ['USD'] },
        },
      );

    it('creates the coupon from what was filled in, then goes back to the list', async () => {
      const result = await renderNew([recordingMock(CreateCouponDocument, couponPayload('createCoupon'))]);

      await user.type(await result.findByLabelText('Coupon code'), 'SAVE5');
      await user.click(result.getByRole('radio', { name: 'Fixed amount discount', hidden: true }));
      await user.clear(result.getByRole('textbox', { name: 'Fixed amount discount', hidden: true }));
      await user.type(result.getByRole('textbox', { name: 'Fixed amount discount', hidden: true }), '5');
      await user.click(result.getByRole('button', { name: 'Create', hidden: true }));

      await waitFor(() => expect(result.getByTestId('location')).toHaveTextContent(/^\/coupons$/));
      expect(sent).toHaveBeenCalledWith({
        coupon: expect.objectContaining({
          code: 'SAVE5',
          fixed_amount: { fractional: 500, currency_code: 'USD' },
          percent_discount: null,
        }),
      });
    });

    it('shows the error, and stays open, if the coupon can’t be created', async () => {
      const result = await renderNew([
        {
          request: { query: CreateCouponDocument, variables: () => true },
          result: { errors: [{ message: 'Code has already been taken' }] },
        },
      ]);

      await user.type(await result.findByLabelText('Coupon code'), 'SAVE5');
      await user.click(result.getByRole('button', { name: 'Create', hidden: true }));

      expect(await result.findByText(/Code has already been taken/)).toBeTruthy();
      expect(result.getByTestId('location')).toHaveTextContent('/coupons/new');
    });

    it('goes back to the list when cancelled', async () => {
      const result = await renderNew();

      await user.click(await result.findByRole('link', { name: 'Cancel', hidden: true }));

      await waitFor(() => expect(result.getByTestId('location')).toHaveTextContent(/^\/coupons$/));
    });
  });

  describe('EditCouponModal', () => {
    const renderEdit = (apolloMocks: MockLink.MockedResponse[]) =>
      renderRoute(
        [
          {
            path: '/coupons',
            Component: CouponListStandIn,
            children: [{ path: ':id', loader: editLoader, action: editAction, Component: EditCouponModal }],
          },
        ],
        {
          apolloMocks: [singleCouponQuery, ...apolloMocks],
          initialEntries: ['/coupons/3'],
          appRootContextValue: { defaultCurrencyCode: 'USD', supportedCurrencyCodes: ['USD'] },
        },
      );

    it('loads the coupon into the form', async () => {
      const result = await renderEdit([]);

      expect(await result.findByLabelText('Coupon code')).toHaveValue('SAVE5');
      expect(result.getByRole('radio', { name: 'Fixed amount discount', hidden: true })).toBeChecked();
      expect(result.getByRole('textbox', { name: 'Fixed amount discount', hidden: true })).toHaveValue('5');
      expect(result.getByLabelText('Usage limit')).toHaveValue(10);
    });

    it('saves the changes and goes back to the list', async () => {
      const updated: UpdateCouponMutationData = couponPayload('updateCoupon') as UpdateCouponMutationData;
      const result = await renderEdit([recordingMock(UpdateCouponDocument, updated), singleCouponQuery]);

      const code = await result.findByLabelText('Coupon code');
      await user.clear(code);
      await user.type(code, 'SAVE10');
      await user.click(result.getByRole('button', { name: 'Save', hidden: true }));

      await waitFor(() => expect(result.getByTestId('location')).toHaveTextContent(/^\/coupons$/));
      expect(sent).toHaveBeenCalledWith({
        id: '3',
        coupon: expect.objectContaining({ code: 'SAVE10', fixed_amount: { fractional: 500, currency_code: 'USD' } }),
      });
    });

    it('deletes the coupon after confirmation, then goes back to the list', async () => {
      const result = await renderEdit([recordingMock(DeleteCouponDocument, deletePayload)]);

      await user.click(await result.findByRole('button', { name: /Delete coupon/, hidden: true }));
      expect(await result.findByText('Are you sure you want to delete this coupon?')).toBeTruthy();
      await user.click(result.getByRole('button', { name: 'OK', hidden: true }));

      await waitFor(() => expect(result.getByTestId('location')).toHaveTextContent(/^\/coupons$/));
      expect(sent).toHaveBeenCalledWith({ id: '3' });
    });

    it('does not delete it if the confirmation is cancelled', async () => {
      const result = await renderEdit([recordingMock(DeleteCouponDocument, deletePayload)]);

      await user.click(await result.findByRole('button', { name: /Delete coupon/, hidden: true }));
      await result.findByText('Are you sure you want to delete this coupon?');
      const footer = result.getByRole('button', { name: 'OK', hidden: true }).closest('.modal-footer') as HTMLElement;
      await user.click(footer.querySelector('button.btn-secondary, button:first-child') as HTMLElement);

      await waitFor(() => expect(result.queryByText(/Are you sure/)).toBeNull());
      expect(sent).not.toHaveBeenCalled();
    });

    it('shows the error if saving fails', async () => {
      const result = await renderEdit([
        {
          request: { query: UpdateCouponDocument, variables: () => true },
          result: { errors: [{ message: 'Usage limit must be positive' }] },
        },
      ]);

      await user.click(await result.findByRole('button', { name: 'Save', hidden: true }));

      expect(await result.findByText(/Usage limit must be positive/)).toBeTruthy();
    });
  });
});
