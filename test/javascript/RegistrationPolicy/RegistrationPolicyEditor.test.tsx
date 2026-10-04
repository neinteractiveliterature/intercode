import { useState } from 'react';
import { render, userEvent, waitFor } from '../testUtils';
import defaultPresets from './defaultPresets';
import RegistrationPolicyEditor, {
  EditingRegistrationPolicy,
  RegistrationPolicyEditorProps,
} from '../../../app/javascript/RegistrationPolicy/RegistrationPolicyEditor';
import { RegistrationPolicyBucket } from '../../../app/javascript/graphqlTypes.generated';
import { EditingRegistrationBucket } from '../../../app/javascript/RegistrationPolicy/RegistrationBucketRow';
import { vi } from 'vitest';

describe('RegistrationPolicyEditor', () => {
  const onChange = vi.fn<(rp: EditingRegistrationPolicy<EditingRegistrationBucket>) => void>();
  let user: ReturnType<typeof userEvent.setup>;
  beforeEach(() => {
    onChange.mockReset();
    user = userEvent.setup();
  });

  const defaultRegistrationPolicyBucket: RegistrationPolicyBucket & Pick<EditingRegistrationBucket, 'generatedId'> = {
    __typename: 'RegistrationPolicyBucket',
    id: 'testBucket',
    key: 'testBucket',
    generatedId: 'testBucket',
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

  type EditorProps = RegistrationPolicyEditorProps<
    EditingRegistrationBucket,
    EditingRegistrationPolicy<EditingRegistrationBucket>
  >;

  // The editor is a controlled component, so to type into it for real (a keystroke at a time) it needs a parent
  // that holds the policy state, the way the real forms do.  onChange still sees every change the editor makes.
  function StatefulEditor({
    initialPolicy,
    ...props
  }: Omit<EditorProps, 'registrationPolicy' | 'onChange'> & {
    initialPolicy: EditingRegistrationPolicy<EditingRegistrationBucket>;
  }) {
    const [registrationPolicy, setRegistrationPolicy] = useState(initialPolicy);
    return (
      <RegistrationPolicyEditor
        {...props}
        registrationPolicy={registrationPolicy}
        onChange={(newPolicy) => {
          setRegistrationPolicy(newPolicy);
          onChange(newPolicy);
        }}
      />
    );
  }

  const renderRegistrationPolicyEditor = async (
    props?: Partial<Omit<EditorProps, 'registrationPolicy' | 'onChange'>>,
    buckets: EditingRegistrationBucket[] = [defaultRegistrationPolicyBucket],
    preventNoPreferenceSignups = false,
  ) => {
    return await render(
      <StatefulEditor
        initialPolicy={{ buckets, prevent_no_preference_signups: preventNoPreferenceSignups }}
        lockNameAndDescription={false}
        lockLimitedBuckets={[]}
        lockDeleteBuckets={[]}
        allowCustom
        {...props}
      />,
    );
  };

  const lastPolicyChange = () => {
    const lastCall = onChange.mock.lastCall;
    if (!lastCall) {
      throw new Error('onChange was never called');
    }
    return lastCall[0];
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
    await user.click(getByText('Add regular bucket'));
    const newPolicy = lastPolicyChange();
    expect(newPolicy.buckets.length).toEqual(2);
    expect(newPolicy.buckets.map((bucket) => bucket.anything)).toEqual([false, false]);
    // A freshly-added bucket has no real id yet -- a fabricated one here would corrupt
    // RegistrationPolicy#sync_buckets_from_hash!'s id-based correlation on save (see #11895/#11897).
    expect(newPolicy.buckets[1].id).toBeUndefined();
    expect(newPolicy.buckets[1].generatedId).toBeTruthy();
  });

  test('add flex bucket', async () => {
    const { getByText } = await renderRegistrationPolicyEditor();
    await user.click(getByText('Add flex bucket'));
    const newPolicy = lastPolicyChange();
    expect(newPolicy.buckets.length).toEqual(2);
    expect(newPolicy.buckets.map((bucket) => bucket.anything)).toEqual([false, true]);
    expect(newPolicy.buckets[1].id).toBeUndefined();
    expect(newPolicy.buckets[1].generatedId).toBeTruthy();
  });

  test('delete bucket', async () => {
    const { getByText } = await renderRegistrationPolicyEditor();
    await user.click(getByText('Delete bucket'));
    await user.click(getByText('OK'));
    await waitFor(() => expect(onChange).toHaveBeenCalled());
    expect(lastPolicyChange().buckets.length).toEqual(0);
  });

  test('change bucket', async () => {
    const { getByLabelText } = await renderRegistrationPolicyEditor();
    await user.clear(getByLabelText('Min'));
    await user.type(getByLabelText('Min'), '1');
    const newPolicy = lastPolicyChange();
    expect(newPolicy.buckets[0].minimum_slots).toEqual(1);
    // Editing a bucket must not lose the real id it entered the editor with -- that id is how the
    // backend correlates this bucket back to its existing row (see #11895/#11897).
    expect(newPolicy.buckets[0].id).toEqual('testBucket');
    expect(newPolicy.buckets[0].generatedId).toEqual('testBucket');
  });

  test('renaming a bucket does not reorder or corrupt sibling buckets', async () => {
    // Regression test for a bug where the bucket list re-sorted by name on every render, so
    // renaming a bucket to alphabetically cross a sibling's name flipped their row order live,
    // mid-edit -- which read as "typing in one bucket's field changes another bucket's field."
    const bucketA = {
      ...defaultRegistrationPolicyBucket,
      id: 'a',
      generatedId: 'a',
      key: 'a',
      name: 'Alpha',
      minimum_slots: 1,
    };
    const bucketB = {
      ...defaultRegistrationPolicyBucket,
      id: 'b',
      generatedId: 'b',
      key: 'b',
      name: 'Beta',
      minimum_slots: 2,
    };

    const { getAllByPlaceholderText, getAllByLabelText } = await renderRegistrationPolicyEditor({}, [bucketA, bucketB]);
    const nameValues = () => getAllByPlaceholderText('Bucket name').map((input) => (input as HTMLInputElement).value);
    const minValues = () => getAllByLabelText('Min').map((input) => (input as HTMLInputElement).value);

    expect(nameValues()).toEqual(['Alpha', 'Beta']);
    expect(minValues()).toEqual(['1', '2']);

    // Rename Alpha to Zeta, a keystroke at a time.  Partway through it passes Beta alphabetically ("Z" > "B"), and
    // the row order (and each row's own values) must stay put -- only the name field's own value should change.
    await user.clear(getAllByPlaceholderText('Bucket name')[0]);
    await user.type(getAllByPlaceholderText('Bucket name')[0], 'Zeta');

    expect(nameValues()).toEqual(['Zeta', 'Beta']);
    expect(minValues()).toEqual(['1', '2']);
    expect(lastPolicyChange().buckets.map((bucket) => bucket.id)).toEqual(['a', 'b']);
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
      id: presetBucket.key,
      generatedId: presetBucket.key,
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

    test('editing one bucket after switching to a preset only changes that bucket', async () => {
      // Regression test: preset buckets used to come through without a generatedId, so editing any bucket after the
      // first one replaced the first bucket with it.
      const { getByRole, getAllByLabelText } = await renderRegistrationPolicyEditor({ presets: defaultPresets });
      await user.selectOptions(getByRole('combobox'), preset.name);
      const namesBefore = lastPolicyChange().buckets.map((bucket) => bucket.name);
      expect(namesBefore).toEqual(presetBuckets.map((bucket) => bucket.name));

      await user.clear(getAllByLabelText('Min')[1]);
      await user.type(getAllByLabelText('Min')[1], '7');

      const buckets = lastPolicyChange().buckets;
      expect(buckets.map((bucket) => bucket.name)).toEqual(namesBefore);
      expect(buckets.map((bucket) => bucket.minimum_slots)).toEqual([undefined, 7, undefined]);
      expect(new Set(buckets.map((bucket) => bucket.generatedId)).size).toBe(buckets.length);
    });

    test('switching to a preset', async () => {
      const { getByRole } = await renderRegistrationPolicyEditor({ presets: defaultPresets });
      await user.selectOptions(getByRole('combobox'), preset.name);
      const newPolicy = lastPolicyChange();
      expect(newPolicy.buckets.map((bucket) => bucket.name)).toEqual(presetBuckets.map((bucket) => bucket.name));
    });
  });
});
