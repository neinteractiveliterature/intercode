import React from 'react';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { List } from 'immutable';
import { ConfirmModal } from 'react-bootstrap4-modal';
import defaultPresets from '../../../app/javascript/RegistrationPolicyPresets';
import RegistrationPolicy from '../../../app/javascript/Models/RegistrationPolicy';
import RegistrationPolicyBucket from '../../../app/javascript/Models/RegistrationPolicyBucket';
import RegistrationPolicyEditor from '../../../app/javascript/BuiltInFormControls/RegistrationPolicyEditor';
import RegistrationBucketRow from '../../../app/javascript/BuiltInFormControls/RegistrationBucketRow';

describe('RegistrationPolicyEditor', () => {
  let onChange;

  const defaultRegistrationPolicyBucket = {
    key: 'testBucket',
    name: 'test',
    description: 'a bucket for testing',
    totalSlots: 10,
    preferredSlots: 5,
    minimumSlots: 2,
    slotsLimited: true,
    anything: false,
  };

  beforeEach(() => {
    onChange = sinon.spy();
  });

  const renderRegistrationPolicyEditor = (
    props,
    buckets = [defaultRegistrationPolicyBucket],
  ) => {
    const bucketList = new List(buckets.map(bucket => new RegistrationPolicyBucket(bucket)));
    return mount((
      <RegistrationPolicyEditor
        registrationPolicy={new RegistrationPolicy(bucketList)}
        onChange={onChange}
        lockNameAndDescription={false}
        lockLimitedBuckets={[]}
        lockDeleteBuckets={[]}
        showKey
        {...props}
      />
    ));
  };

  test('basic layout', () => {
    const component = renderRegistrationPolicyEditor();
    expect(component.find('th').length).toEqual(5);
    expect(component.find(RegistrationBucketRow).length).toEqual(1);
    expect(component.find('ul button').length).toEqual(2);
  });

  test('showKey', () => {
    const component = renderRegistrationPolicyEditor({ showKey: false });
    expect(component.find('th').length).toEqual(4);
    expect(component.text()).not.toMatch(/testBucket/);
  });

  test('lockNameAndDescription', () => {
    const component = renderRegistrationPolicyEditor({ lockNameAndDescription: true });
    expect(component.find('th').length).toEqual(4);
    expect(component.text()).not.toMatch(/a bucket for testing/);
  });

  test('lockLimitedBuckets', () => {
    const component = renderRegistrationPolicyEditor({ lockLimitedBuckets: ['testBucket'] });
    expect(component.find('th').length).toEqual(5);
    expect(component.find('input[type="checkbox"]').length).toEqual(0);
  });

  test('lockDeleteBuckets', () => {
    const component = renderRegistrationPolicyEditor({ lockDeleteBuckets: ['testBucket'] });
    expect(component.find('th').length).toEqual(5);
    expect(component.find('i.fa-trash-o').length).toEqual(0);
  });

  test('add regular bucket', () => {
    const component = renderRegistrationPolicyEditor();
    component.find('ul button').at(0).simulate('click');
    const newPolicy = onChange.getCall(0).args[0];
    expect(newPolicy.buckets.size).toEqual(2);
    expect(newPolicy.buckets.map(bucket => bucket.anything).toJS()).toEqual([false, false]);
  });

  test('add anything bucket', () => {
    const component = renderRegistrationPolicyEditor();
    component.find('ul button').at(1).simulate('click');
    const newPolicy = onChange.getCall(0).args[0];
    expect(newPolicy.buckets.size).toEqual(2);
    expect(newPolicy.buckets.map(bucket => bucket.anything).toJS()).toEqual([false, true]);
  });

  test('delete bucket', () => {
    const component = renderRegistrationPolicyEditor();
    const row = component.find(RegistrationBucketRow);
    const trashIcon = component.find('i.fa-trash-o').get(0);
    row.find('button').filterWhere(button => button.contains(trashIcon)).simulate('click');
    row.find(ConfirmModal).find('button').at(1).simulate('click');
    const newPolicy = onChange.getCall(0).args[0];
    expect(newPolicy.buckets.size).toEqual(0);
  });

  test('change bucket', () => {
    const component = renderRegistrationPolicyEditor();
    const row = component.find(RegistrationBucketRow);
    const minimumSlotsInput = row.find('input[type="number"]').at(0);
    minimumSlotsInput.simulate('change', { target: { value: 1 } });
    const newPolicy = onChange.getCall(0).args[0];
    expect(newPolicy.buckets.get(0).get('minimumSlots')).toEqual(1);
  });

  describe('with presets', () => {
    const preset = defaultPresets.find(aPreset => aPreset.name === 'Limited slots by gender');
    const presetBuckets = preset.policy.buckets.map(presetBucket =>
      ({ ...defaultRegistrationPolicyBucket, ...presetBucket }));

    test('renders the selector by default', () => {
      const component = renderRegistrationPolicyEditor({ presets: defaultPresets }, []);
      expect(component.find('select').length).toEqual(1);
      expect(component.find('select option').length).toEqual(5); // number of presets + blank + custom
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
      expect(component.find('th').length).toEqual(5);
      expect(component.text()).not.toMatch(new RegExp(presetBuckets[0].description));
    });

    test('locks limited for matching buckets when in a preset', () => {
      const component = renderRegistrationPolicyEditor({ presets: defaultPresets }, presetBuckets);
      expect(component.find('th').length).toEqual(5);
      expect(component.find('input[type="checkbox"]').length).toEqual(0);
    });

    test('locks delete for matching buckets when in a preset', () => {
      const component = renderRegistrationPolicyEditor({ presets: defaultPresets }, presetBuckets);
      expect(component.find('th').length).toEqual(5);
      expect(component.find('i.fa-trash-o').length).toEqual(0);
    });

    test('locks adding buckets when in a preset', () => {
      const component = renderRegistrationPolicyEditor({ presets: defaultPresets }, presetBuckets);
      expect(component.find('ul button').length).toEqual(0);
    });

    test('switching to a preset', () => {
      const component = renderRegistrationPolicyEditor({ presets: defaultPresets });
      component.find('select').simulate('change', { target: { value: preset.name } });
      const newPolicy = onChange.getCall(0).args[0];
      expect(newPolicy.buckets.map(bucket => bucket.get('name')).toJS()).toEqual(presetBuckets.map(bucket => bucket.name));
    });
  });
});
