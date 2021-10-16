import { RenderResult } from '@testing-library/react';

import RegistrationBucketRow from '../../../app/javascript/RegistrationPolicy/RegistrationBucketRow';
import { render, act, fireEvent, waitFor } from '../testUtils';

describe('RegistrationBucketRow', () => {
  let onChange: jest.Mock;
  let onDelete: jest.Mock;

  const defaultRegistrationBucketProps = {
    key: 'testBucket',
    name: 'test',
    description: 'a bucket for testing',
    total_slots: 10,
    preferred_slots: 5,
    minimum_slots: 2,
    slots_limited: true,
    anything: false,
  };

  beforeEach(() => {
    onChange = jest.fn();
    onDelete = jest.fn();
  });

  const renderRegistrationBucketRow = async (props = {}, registrationBucketProps = {}) => {
    let result: RenderResult;

    await act(async () => {
      result = await render(
        <table>
          <tbody>
            <RegistrationBucketRow
              registrationBucket={{
                ...defaultRegistrationBucketProps,
                ...registrationBucketProps,
              }}
              onChange={onChange}
              onDelete={onDelete}
              lockNameAndDescription={false}
              lockLimited={false}
              lockDelete={false}
              {...props}
            />
          </tbody>
        </table>,
      );

      await waitFor(() => {}); // TODO: figure out a better way
    });

    // @ts-expect-error This is going to get assigned during the act call
    return result;
  };

  test('it renders the correct field values', async () => {
    const { getByDisplayValue, getByLabelText, getByRole, getByText } = await renderRegistrationBucketRow();
    expect(getByRole('row')).not.toHaveClass('anything-bucket');
    expect(getByDisplayValue('test')).toBeTruthy();
    expect(getByDisplayValue('a bucket for testing')).toBeTruthy();
    expect((getByLabelText('Unlimited?') as HTMLInputElement).checked).toBeFalsy();
    expect((getByLabelText('Counted for signups?') as HTMLInputElement).checked).toBeTruthy();
    expect(getByLabelText('Min')).toHaveValue(2);
    expect(getByLabelText('Pref')).toHaveValue(5);
    expect(getByLabelText('Max')).toHaveValue(10);
    expect(getByText('Delete bucket')).toBeTruthy();
  });

  test('lockNameAndDescription', async () => {
    const { getByText } = await renderRegistrationBucketRow({ lockNameAndDescription: true });
    expect(getByText('test')).toBeTruthy();
  });

  test('lockLimited', async () => {
    const { queryAllByLabelText } = await renderRegistrationBucketRow({ lockLimited: true });
    expect(queryAllByLabelText('Unlimited?')).toHaveLength(0);
  });

  test('lockDelete', async () => {
    const { queryAllByText } = await renderRegistrationBucketRow({ lockDelete: true });
    expect(queryAllByText('Delete bucket')).toHaveLength(0);
  });

  test('anything bucket renders properly', async () => {
    const { getByRole } = await renderRegistrationBucketRow({}, { anything: true });
    expect(getByRole('row')).toHaveClass('anything-bucket');
  });

  test('changing the name', async () => {
    const { getByLabelText } = await renderRegistrationBucketRow();
    fireEvent.focus(getByLabelText('Bucket name'));
    fireEvent.change(getByLabelText('Bucket name'), { target: { value: 'new name' } });
    expect(onChange.mock.calls[0][0]).toEqual('testBucket');
    expect(onChange.mock.calls[0][1].name).toEqual('new name');
    expect(onChange.mock.calls[0][1].key).toEqual('testBucket');
  });

  test('changing the description', async () => {
    const { getByLabelText } = await renderRegistrationBucketRow();
    fireEvent.focus(getByLabelText('Bucket description'));
    fireEvent.change(getByLabelText('Bucket description'), {
      target: { value: 'a new description' },
    });
    expect(onChange.mock.calls[0][0]).toEqual('testBucket');
    expect(onChange.mock.calls[0][1].description).toEqual('a new description');
  });

  test('changing unlimited checkbox', async () => {
    const { getByLabelText } = await renderRegistrationBucketRow();
    fireEvent.click(getByLabelText('Unlimited?'));
    expect(onChange.mock.calls[0][0]).toEqual('testBucket');
    expect(onChange.mock.calls[0][1].slots_limited).toEqual(false);
  });

  test('changing counted checkbox', async () => {
    const { getByLabelText } = await renderRegistrationBucketRow();
    fireEvent.click(getByLabelText('Counted for signups?'));
    expect(onChange.mock.calls[0][0]).toEqual('testBucket');
    expect(onChange.mock.calls[0][1].not_counted).toEqual(true);
  });

  test('changing minimumSlots', async () => {
    const { getByLabelText } = await renderRegistrationBucketRow();
    fireEvent.change(getByLabelText('Min'), { target: { value: '4' } });
    expect(onChange.mock.calls[0][0]).toEqual('testBucket');
    expect(onChange.mock.calls[0][1].minimum_slots).toEqual(4);
  });

  test('changing preferredSlots', async () => {
    const { getByLabelText } = await renderRegistrationBucketRow();
    fireEvent.change(getByLabelText('Pref'), { target: { value: '6' } });
    expect(onChange.mock.calls[0][0]).toEqual('testBucket');
    expect(onChange.mock.calls[0][1].preferred_slots).toEqual(6);
  });

  test('changing totalSlots', async () => {
    const { getByLabelText } = await renderRegistrationBucketRow();
    fireEvent.change(getByLabelText('Max'), { target: { value: '55' } });
    expect(onChange.mock.calls[0][0]).toEqual('testBucket');
    expect(onChange.mock.calls[0][1].total_slots).toEqual(55);
  });

  test('deleting', async () => {
    const { getByText } = await renderRegistrationBucketRow();
    await act(async () => {
      fireEvent.click(getByText('Delete bucket'));
      await waitFor(() => expect(getByText('OK')).toBeVisible());
      fireEvent.click(getByText('OK'));
      await waitFor(() => expect(getByText('OK')).not.toBeVisible());
    });
    expect(onDelete.mock.calls[0][0]).toEqual('testBucket');
  });

  test('canceling delete', async () => {
    const { getByText } = await renderRegistrationBucketRow();
    await act(async () => {
      fireEvent.click(getByText('Delete bucket'));
      await waitFor(() => expect(getByText('Cancel')).toBeVisible());
      fireEvent.click(getByText('Cancel'));
      await waitFor(() => expect(getByText('Cancel')).not.toBeVisible());
    });
    expect(onDelete.mock.calls).toHaveLength(0);
  });
});
