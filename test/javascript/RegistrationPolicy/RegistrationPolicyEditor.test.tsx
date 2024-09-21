import { render, fireEvent, waitFor } from '../testUtils';
import defaultPresets from './defaultPresets';
import RegistrationPolicyEditor, {
  EditingRegistrationPolicy,
  RegistrationPolicyEditorProps,
} from '../../../app/javascript/RegistrationPolicy/RegistrationPolicyEditor';
import { RegistrationPolicy, RegistrationPolicyBucket } from '../../../app/javascript/graphqlTypes.generated';
import { EditingRegistrationBucket } from '../../../app/javascript/RegistrationPolicy/RegistrationBucketRow';
import { vi } from 'vitest';

describe('RegistrationPolicyEditor', () => {
  const onChange = vi.fn<(rp: RegistrationPolicy) => void>();
  beforeEach(onChange.mockReset);

  const defaultRegistrationPolicyBucket: RegistrationPolicyBucket = {
    __typename: 'RegistrationPolicyBucket',
    key: 'testBucket',
    name: 'test',
    description: 'a bucket for testing',
    total_slots: 10,
    preferred_slots: 5,
    minimum_slots: 2,
    slots_limited: true,
    anything: false,
    expose_attendees: false,
    not_counted: false,
  };

  const renderRegistrationPolicyEditor = async (
    props?: Partial<
      RegistrationPolicyEditorProps<EditingRegistrationBucket, EditingRegistrationPolicy<EditingRegistrationBucket>>
    >,
    buckets: RegistrationPolicyBucket[] = [defaultRegistrationPolicyBucket],
    preventNoPreferenceSignups = false,
  ) => {
    return await render(
      <RegistrationPolicyEditor
        registrationPolicy={{
          buckets,
          prevent_no_preference_signups: preventNoPreferenceSignups,
        }}
        onChange={onChange}
        lockNameAndDescription={false}
        lockLimitedBuckets={[]}
        lockDeleteBuckets={[]}
        allowCustom
        {...props}
      />,
    );
  };

  test('basic layout', async () => {
    const { getByText, getByDisplayValue, queryAllByRole } = await renderRegistrationPolicyEditor();
    expect(getByText('Bucket name/description')).toBeTruthy();
    expect(getByDisplayValue('a bucket for testing')).toBeTruthy();
    expect(queryAllByRole('checkbox')).toHaveLength(3);
    expect(getByText('Delete bucket')).toBeTruthy();
    expect(getByText('Add regular bucket')).toBeTruthy();
    expect(getByText('Add flex bucket')).toBeTruthy();
  });

  test('lockNameAndDescription', async () => {
    const { getByText, queryAllByDisplayValue } = await renderRegistrationPolicyEditor({
      lockNameAndDescription: true,
    });
    expect(getByText('Bucket name')).toBeTruthy();
    expect(getByText('test')).toBeTruthy();
    expect(queryAllByDisplayValue('a bucket for testing')).toHaveLength(0);
  });

  test('lockLimitedBuckets', async () => {
    const { queryAllByRole } = await renderRegistrationPolicyEditor({
      lockLimitedBuckets: ['testBucket'],
    });
    expect(queryAllByRole('checkbox')).toHaveLength(0);
  });

  test('lockDeleteBuckets', async () => {
    const { queryAllByText } = await renderRegistrationPolicyEditor({
      lockDeleteBuckets: ['testBucket'],
    });
    expect(queryAllByText('Delete bucket')).toHaveLength(0);
  });

  test('add regular bucket', async () => {
    const { getByText } = await renderRegistrationPolicyEditor();
    fireEvent.click(getByText('Add regular bucket'));
    const newPolicy = onChange.mock.calls[0][0];
    expect(newPolicy.buckets.length).toEqual(2);
    expect(newPolicy.buckets.map((bucket) => bucket.anything)).toEqual([false, false]);
  });

  test('add flex bucket', async () => {
    const { getByText } = await renderRegistrationPolicyEditor();
    fireEvent.click(getByText('Add flex bucket'));
    const newPolicy = onChange.mock.calls[0][0];
    expect(newPolicy.buckets.length).toEqual(2);
    expect(newPolicy.buckets.map((bucket) => bucket.anything)).toEqual([false, true]);
  });

  test('delete bucket', async () => {
    const { getByText } = await renderRegistrationPolicyEditor();
    fireEvent.click(getByText('Delete bucket'));
    fireEvent.click(getByText('OK'));
    await waitFor(() => {}); // TODO figure out a way to use waitForElementToBeRemoved here
    const newPolicy = onChange.mock.calls[0][0];
    expect(newPolicy.buckets.length).toEqual(0);
  });

  test('change bucket', async () => {
    const { getByLabelText } = await renderRegistrationPolicyEditor();
    fireEvent.change(getByLabelText('Min'), { target: { value: '1' } });
    const newPolicy = onChange.mock.calls[0][0];
    expect(newPolicy.buckets[0].minimum_slots).toEqual(1);
  });

  describe('with presets', () => {
    const preset = defaultPresets.find(
      (aPreset) => aPreset.name === 'Limited slots by gender (classic Intercon-style)',
    );
    if (!preset) {
      throw new Error("Couldn't find preset");
    }
    const presetBuckets = preset.policy.buckets.map((presetBucket) => ({
      ...defaultRegistrationPolicyBucket,
      ...presetBucket,
    }));

    test('renders the selector by default', async () => {
      const { getByRole, queryAllByRole } = await renderRegistrationPolicyEditor({ presets: defaultPresets }, []);
      expect(getByRole('combobox')).toBeTruthy();
      expect(queryAllByRole('option')).toHaveLength(7); // number of presets + blank + custom
    });

    test('pre-selects a matching preset', async () => {
      const { getByRole } = await renderRegistrationPolicyEditor({ presets: defaultPresets }, presetBuckets);
      expect(getByRole('combobox')).toHaveValue(preset.name);
    });

    test('pre-selects "custom" when the buckets do not match any preset', async () => {
      const { getByRole } = await renderRegistrationPolicyEditor({ presets: defaultPresets });
      expect(getByRole('combobox')).toHaveValue('_custom');
    });

    test('locks name and description for matching buckets when in a preset', async () => {
      const { getByText, queryAllByText, queryAllByDisplayValue } = await renderRegistrationPolicyEditor(
        { presets: defaultPresets },
        presetBuckets,
      );
      expect(getByText('Bucket name')).toBeTruthy();
      expect(queryAllByText('Female role')).not.toHaveLength(0);
      expect(queryAllByDisplayValue('Male characters')).toHaveLength(0);
    });

    test('locks limited for matching buckets when in a preset', async () => {
      const { queryAllByRole } = await renderRegistrationPolicyEditor({ presets: defaultPresets }, presetBuckets);
      expect(queryAllByRole('checkbox')).toHaveLength(0);
    });

    test('locks delete for matching buckets when in a preset', async () => {
      const { queryAllByText } = await renderRegistrationPolicyEditor({ presets: defaultPresets }, presetBuckets);
      expect(queryAllByText('Delete bucket')).toHaveLength(0);
    });

    test('locks adding buckets when in a preset', async () => {
      const { queryAllByText } = await renderRegistrationPolicyEditor({ presets: defaultPresets }, presetBuckets);
      expect(queryAllByText('Add regular bucket')).toHaveLength(0);
      expect(queryAllByText('Add flex bucket')).toHaveLength(0);
    });

    test('switching to a preset', async () => {
      const { getByRole } = await renderRegistrationPolicyEditor({ presets: defaultPresets });
      fireEvent.change(getByRole('combobox'), { target: { value: preset.name } });
      const newPolicy = onChange.mock.calls[0][0];
      expect(newPolicy.buckets.map((bucket) => bucket.name)).toEqual(presetBuckets.map((bucket) => bucket.name));
    });
  });
});
