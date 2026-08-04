import { fireEvent, render as rtlRender, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { vi } from 'vitest';
import getI18n from '../../../app/javascript/setupI18Next';
import BucketKeyRemappingModal, {
  BucketKeyRemappingModalProps,
} from '../../../app/javascript/EventAdmin/BucketKeyRemappingModal';

// Deliberately bypasses the shared testUtils render wrapper for this file: that wrapper recreates
// its RouterProvider's router on every render, which causes React to treat a `rerender()` call as
// a fresh mount rather than a prop update on the existing instance. The bug under test here only
// reproduces when a persisting component instance receives a prop update, so this needs a real,
// non-remounting rerender -- both render and rerender wrap with the same I18nextProvider instance
// so the root element type stays stable across rerenders.
describe('BucketKeyRemappingModal', () => {
  const onConfirm = vi.fn<BucketKeyRemappingModalProps['onConfirm']>().mockResolvedValue(undefined);
  const onCancel = vi.fn<BucketKeyRemappingModalProps['onCancel']>();

  beforeEach(() => {
    onConfirm.mockClear();
    onCancel.mockClear();
  });

  // Regression test: this modal is mounted once, up front, with removedBuckets: [] before the
  // admin ever clicks Save -- removedBuckets only becomes non-empty later, as a prop update on the
  // already-mounted component (see useBucketKeyRemapping). Confirming without ever touching a
  // bucket's dropdown (i.e. accepting the default "No preference", which is already selected)
  // previously submitted an empty mapping list instead of one entry per removed bucket.
  test('submits a mapping for a removed bucket even if its dropdown is left at the default', async () => {
    const i18nInstance = await getI18n();
    const wrap = (ui: React.JSX.Element) => <I18nextProvider i18n={i18nInstance}>{ui}</I18nextProvider>;

    const { rerender, getByText } = rtlRender(
      wrap(
        <BucketKeyRemappingModal
          visible={false}
          removedBuckets={[]}
          newPolicyBuckets={[{ key: 'dogs', name: 'Dogs' }]}
          onConfirm={onConfirm}
          onCancel={onCancel}
        />,
      ),
    );

    rerender(
      wrap(
        <BucketKeyRemappingModal
          visible
          removedBuckets={[{ key: 'signups', name: 'Cats' }]}
          newPolicyBuckets={[{ key: 'dogs', name: 'Dogs' }]}
          onConfirm={onConfirm}
          onCancel={onCancel}
        />,
      ),
    );
    await waitFor(() => {});

    fireEvent.click(getByText('Apply and save event'));

    await waitFor(() => expect(onConfirm).toHaveBeenCalledWith([{ from_key: 'signups', to_key: undefined }]));
  });

  test('submits the selected destination bucket when one is chosen', async () => {
    const i18nInstance = await getI18n();
    const wrap = (ui: React.JSX.Element) => <I18nextProvider i18n={i18nInstance}>{ui}</I18nextProvider>;

    const { rerender, getByRole, getByText } = rtlRender(
      wrap(
        <BucketKeyRemappingModal
          visible={false}
          removedBuckets={[]}
          newPolicyBuckets={[{ key: 'dogs', name: 'Dogs' }]}
          onConfirm={onConfirm}
          onCancel={onCancel}
        />,
      ),
    );

    rerender(
      wrap(
        <BucketKeyRemappingModal
          visible
          removedBuckets={[{ key: 'signups', name: 'Cats' }]}
          newPolicyBuckets={[{ key: 'dogs', name: 'Dogs' }]}
          onConfirm={onConfirm}
          onCancel={onCancel}
        />,
      ),
    );
    await waitFor(() => {});

    fireEvent.change(getByRole('combobox', { hidden: true }), { target: { value: 'dogs' } });
    fireEvent.click(getByText('Apply and save event'));

    await waitFor(() => expect(onConfirm).toHaveBeenCalledWith([{ from_key: 'signups', to_key: 'dogs' }]));
  });
});
