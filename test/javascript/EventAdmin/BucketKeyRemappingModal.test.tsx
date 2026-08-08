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

  async function renderModal() {
    const i18nInstance = await getI18n();
    const wrap = (ui: React.JSX.Element) => <I18nextProvider i18n={i18nInstance}>{ui}</I18nextProvider>;

    const result = rtlRender(
      wrap(
        <BucketKeyRemappingModal
          visible={false}
          removedBuckets={[]}
          newPolicyBuckets={[{ key: 'dogs', name: 'Dogs' }]}
          preventNoPreferenceSignups={false}
          onConfirm={onConfirm}
          onCancel={onCancel}
        />,
      ),
    );

    return { ...result, wrap };
  }

  // Regression test: this modal is mounted once, up front, with removedBuckets: [] before the
  // admin ever clicks Save -- removedBuckets only becomes non-empty later, as a prop update on the
  // already-mounted component (see useBucketKeyRemapping). Confirming without ever touching a
  // bucket's dropdown (i.e. accepting the default "No preference", which is already selected)
  // previously submitted an empty mapping list instead of one entry per removed bucket.
  test('submits a mapping for a removed bucket even if its dropdown is left at the default', async () => {
    const { rerender, wrap, getByText } = await renderModal();

    rerender(
      wrap(
        <BucketKeyRemappingModal
          visible
          removedBuckets={[{ id: '1', key: 'signups', name: 'Cats' }]}
          newPolicyBuckets={[{ key: 'dogs', name: 'Dogs' }]}
          preventNoPreferenceSignups={false}
          onConfirm={onConfirm}
          onCancel={onCancel}
        />,
      ),
    );
    await waitFor(() => {});

    fireEvent.click(getByText('Apply and save event'));

    await waitFor(() => expect(onConfirm).toHaveBeenCalledWith([{ from_bucket_id: '1', to_key: undefined }]));
  });

  test('submits the selected destination bucket when one is chosen', async () => {
    const { rerender, wrap, getByRole, getByText } = await renderModal();

    rerender(
      wrap(
        <BucketKeyRemappingModal
          visible
          removedBuckets={[{ id: '1', key: 'signups', name: 'Cats' }]}
          newPolicyBuckets={[{ key: 'dogs', name: 'Dogs' }]}
          preventNoPreferenceSignups={false}
          onConfirm={onConfirm}
          onCancel={onCancel}
        />,
      ),
    );
    await waitFor(() => {});

    fireEvent.change(getByRole('combobox', { hidden: true }), { target: { value: 'dogs' } });
    fireEvent.click(getByText('Apply and save event'));

    await waitFor(() => expect(onConfirm).toHaveBeenCalledWith([{ from_bucket_id: '1', to_key: 'dogs' }]));
  });

  describe('when the new policy disallows no-preference signups', () => {
    test('does not offer "No preference" as an option', async () => {
      const { rerender, wrap, getByRole } = await renderModal();

      rerender(
        wrap(
          <BucketKeyRemappingModal
            visible
            removedBuckets={[{ id: '1', key: 'signups', name: 'Cats' }]}
            newPolicyBuckets={[{ key: 'dogs', name: 'Dogs' }]}
            preventNoPreferenceSignups
            onConfirm={onConfirm}
            onCancel={onCancel}
          />,
        ),
      );
      await waitFor(() => {});

      const select = getByRole('combobox', { hidden: true }) as HTMLSelectElement;
      const optionLabels = Array.from(select.options).map((option) => option.label);
      expect(optionLabels).not.toContain('No preference');
    });

    test('disables Apply until every removed bucket has a real bucket selected', async () => {
      const { rerender, wrap, getByRole, getByText } = await renderModal();

      rerender(
        wrap(
          <BucketKeyRemappingModal
            visible
            removedBuckets={[{ id: '1', key: 'signups', name: 'Cats' }]}
            newPolicyBuckets={[{ key: 'dogs', name: 'Dogs' }]}
            preventNoPreferenceSignups
            onConfirm={onConfirm}
            onCancel={onCancel}
          />,
        ),
      );
      await waitFor(() => {});

      const confirmButton = getByText('Apply and save event').closest('button');
      expect(confirmButton).toBeDisabled();

      fireEvent.change(getByRole('combobox', { hidden: true }), { target: { value: 'dogs' } });
      expect(confirmButton).not.toBeDisabled();

      fireEvent.click(getByText('Apply and save event'));

      await waitFor(() => expect(onConfirm).toHaveBeenCalledWith([{ from_bucket_id: '1', to_key: 'dogs' }]));
    });
  });
});
