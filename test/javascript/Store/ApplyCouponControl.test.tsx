import { vi } from 'vitest';

import { render, userEvent, waitFor } from '../testUtils';
import ApplyCouponControl from '../../../app/javascript/Store/ApplyCouponControl';

describe('ApplyCouponControl', () => {
  let user: ReturnType<typeof userEvent.setup>;
  const createCouponApplication = vi.fn<(code: string) => Promise<unknown>>();

  beforeEach(() => {
    user = userEvent.setup();
    createCouponApplication.mockReset();
    createCouponApplication.mockResolvedValue(undefined);
  });

  const renderControl = () => render(<ApplyCouponControl createCouponApplication={createCouponApplication} />);

  it('applies the typed coupon code when Apply is clicked, then clears the box', async () => {
    const { getByRole } = await renderControl();
    const codeInput = getByRole('textbox', { name: /coupon code/i });

    await user.type(codeInput, 'SAVE5');
    await user.click(getByRole('button', { name: 'Apply' }));

    expect(createCouponApplication).toHaveBeenCalledWith('SAVE5');
    await waitFor(() => expect(codeInput).toHaveValue(''));
  });

  it('applies the code when Enter is pressed in the box', async () => {
    const { getByRole } = await renderControl();
    const codeInput = getByRole('textbox', { name: /coupon code/i });

    await user.type(codeInput, 'SAVE5{Enter}');

    expect(createCouponApplication).toHaveBeenCalledWith('SAVE5');
    await waitFor(() => expect(codeInput).toHaveValue(''));
  });

  it('disables the box and the button while applying', async () => {
    let finishApplying: () => void = () => {};
    createCouponApplication.mockReturnValue(
      new Promise<void>((resolve) => {
        finishApplying = resolve;
      }),
    );
    const { getByRole } = await renderControl();

    await user.type(getByRole('textbox', { name: /coupon code/i }), 'SAVE5');
    await user.click(getByRole('button', { name: 'Apply' }));

    await waitFor(() => expect(getByRole('button', { name: 'Apply' })).toBeDisabled());
    expect(getByRole('textbox', { name: /coupon code/i })).toBeDisabled();

    finishApplying();
    await waitFor(() => expect(getByRole('button', { name: 'Apply' })).toBeEnabled());
  });

  it('shows the error and keeps the code in the box, so it can be corrected, if applying fails', async () => {
    createCouponApplication.mockRejectedValue(new Error('That coupon has expired'));
    const { getByRole, findByText } = await renderControl();
    const codeInput = getByRole('textbox', { name: /coupon code/i });

    await user.type(codeInput, 'OLDCODE');
    await user.click(getByRole('button', { name: 'Apply' }));

    expect(await findByText(/That coupon has expired/)).toBeTruthy();
    expect(codeInput).toHaveValue('OLDCODE');
    expect(getByRole('button', { name: 'Apply' })).toBeEnabled();
  });
});
