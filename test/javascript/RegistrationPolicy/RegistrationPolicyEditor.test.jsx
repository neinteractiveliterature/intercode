import React from 'react';
import { mount } from 'enzyme';
import { ConfirmModal } from 'react-bootstrap4-modal';
import Confirm from '../../../app/javascript/ModalDialogs/Confirm';
import defaultPresets from './defaultPresets';
import RegistrationPolicyEditor from '../../../app/javascript/RegistrationPolicy/RegistrationPolicyEditor';
import RegistrationBucketRow from '../../../app/javascript/RegistrationPolicy/RegistrationBucketRow';

describe('RegistrationPolicyEditor', () => {
  const onChange = jest.fn();
  beforeEach(onChange.mockReset);

  const defaultRegistrationPolicyBucket = {
    key: 'testBucket',
    name: 'test',
    description: 'a bucket for testing',
    total_slots: 10,
    preferred_slots: 5,
    minimum_slots: 2,
    slots_limited: true,
    anything: false,
  };

  const renderRegistrationPolicyEditor = (
    props,
    buckets = [defaultRegistrationPolicyBucket],
    preventNoPreferenceSignups = false,
  ) => {
    return mount((
      <Confirm>
        <RegistrationPolicyEditor
          registrationPolicy={{ buckets, prevent_no_preference_signups: preventNoPreferenceSignups }}
          onChange={onChange}
          lockNameAndDescription={false}
          lockLimitedBuckets={[]}
          lockDeleteBuckets={[]}
          allowCustom
          {...props}
        />
      </Confirm>
    ));
  };

  test('basic layout', () => {
    const component = renderRegistrationPolicyEditor();
    expect(component.find('th').length).toEqual(3);
    expect(component.find(RegistrationBucketRow).length).toEqual(1);
    expect(component.find('ul button').length).toEqual(2);
  });

  test('lockNameAndDescription', () => {
    const component = renderRegistrationPolicyEditor({ lockNameAndDescription: true });
    expect(component.find('th').length).toEqual(3);
    expect(component.find('table').text()).toMatch(/test/);
    expect(component.find('table').text()).not.toMatch(/a bucket for testing/);
  });

  test('lockLimitedBuckets', () => {
    const component = renderRegistrationPolicyEditor({ lockLimitedBuckets: ['testBucket'] });
    expect(component.find('th').length).toEqual(3);
    expect(component.find('input[type="checkbox"]').length).toEqual(0);
  });

  test('lockDeleteBuckets', () => {
    const component = renderRegistrationPolicyEditor({ lockDeleteBuckets: ['testBucket'] });
    expect(component.find('th').length).toEqual(3);
    expect(component.find('i.fa-trash-o').length).toEqual(0);
  });

  test('add regular bucket', () => {
    const component = renderRegistrationPolicyEditor();
    component.find('ul button').at(0).simulate('click');
    const newPolicy = onChange.mock.calls[0][0];
    expect(newPolicy.buckets.length).toEqual(2);
    expect(newPolicy.buckets.map(bucket => bucket.anything)).toEqual([false, false]);
  });

  test('add flex bucket', () => {
    const component = renderRegistrationPolicyEditor();
    component.find('ul button').at(1).simulate('click');
    const newPolicy = onChange.mock.calls[0][0];
    expect(newPolicy.buckets.length).toEqual(2);
    expect(newPolicy.buckets.map(bucket => bucket.anything)).toEqual([false, true]);
  });

  test('delete bucket', () => {
    const component = renderRegistrationPolicyEditor();
    const row = component.find(RegistrationBucketRow);
    const trashIcon = component.find('i.fa-trash-o').get(0);
    row.find('button').filterWhere(button => button.contains(trashIcon)).simulate('click');
    component.find(ConfirmModal).find('button').at(1).simulate('click');
    const newPolicy = onChange.mock.calls[0][0];
    expect(newPolicy.buckets.length).toEqual(0);
  });

  test('change bucket', () => {
    const component = renderRegistrationPolicyEditor();
    const row = component.find(RegistrationBucketRow);
    const minimumSlotsInput = row.find('input[type="number"]').at(0);
    minimumSlotsInput.simulate('change', { target: { value: 1 } });
    const newPolicy = onChange.mock.calls[0][0];
    expect(newPolicy.buckets[0].minimum_slots).toEqual(1);
  });

  describe('with presets', () => {
    const preset = defaultPresets.find(aPreset => aPreset.name === 'Limited slots by gender (classic Intercon-style)');
    const presetBuckets = preset.policy.buckets.map(presetBucket => ({
      ...defaultRegistrationPolicyBucket,
      ...presetBucket,
    }));

    test('renders the selector by default', () => {
      const component = renderRegistrationPolicyEditor({ presets: defaultPresets }, []);
      expect(component.find('select').length).toEqual(1);
      expect(component.find('select option').length).toEqual(7); // number of presets + blank + custom
      expect(component.find(RegistrationBucketRow).length).toEqual(0);
      expect(component.find('ul button').length).toEqual(0);
    });

    test('pre-selects a matching preset', () => {
      const component = renderRegistrationPolicyEditor({ presets: defaultPresets }, presetBuckets);
      expect(component.find('select').prop('value')).toEqual(preset.name);
    });

    test('pre-selects "custom" when the buckets do not match any preset', () => {
      const component = renderRegistrationPolicyEditor({ presets: defaultPresets });
      expect(component.find('select').prop('value')).toEqual('_custom');
    });

    test('locks name and description for matching buckets when in a preset', () => {
      const component = renderRegistrationPolicyEditor({ presets: defaultPresets }, presetBuckets);
      expect(component.find('th').length).toEqual(3);
      expect(component.find('tbody tr').at(0).text()).toMatch(new RegExp(presetBuckets[0].name));
      expect(component.find('tbody tr').at(0).text()).not.toMatch(new RegExp(presetBuckets[0].description));
    });

    test('locks limited for matching buckets when in a preset', () => {
      const component = renderRegistrationPolicyEditor({ presets: defaultPresets }, presetBuckets);
      expect(component.find('th').length).toEqual(3);
      expect(component.find('input[type="checkbox"]').length).toEqual(0);
    });

    test('locks delete for matching buckets when in a preset', () => {
      const component = renderRegistrationPolicyEditor({ presets: defaultPresets }, presetBuckets);
      expect(component.find('th').length).toEqual(3);
      expect(component.find('i.fa-trash-o').length).toEqual(0);
    });

    test('locks adding buckets when in a preset', () => {
      const component = renderRegistrationPolicyEditor({ presets: defaultPresets }, presetBuckets);
      expect(component.find('ul button').length).toEqual(0);
    });

    test('switching to a preset', () => {
      const component = renderRegistrationPolicyEditor({ presets: defaultPresets });
      component.find('select').simulate('change', { target: { value: preset.name } });
      const newPolicy = onChange.mock.calls[0][0];
      expect(newPolicy.buckets.map(bucket => bucket.name)).toEqual(presetBuckets.map(bucket => bucket.name));
    });
  });
});
