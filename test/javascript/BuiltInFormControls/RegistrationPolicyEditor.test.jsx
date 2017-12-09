import React from 'react';
import sinon from 'sinon';
import { mount } from 'enzyme';
import defaultPresets from '../../../app/javascript/RegistrationPolicyPresets';
import InPlaceEditor from '../../../app/javascript/BuiltInFormControls/InPlaceEditor';
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
  ) => mount((
    <RegistrationPolicyEditor
      registrationPolicy={
        new RegistrationPolicy(buckets.map(bucket => new RegistrationPolicyBucket(bucket)))
      }
      onChange={onChange}
      lockNameAndDescription={false}
      lockLimitedBuckets={[]}
      lockDeleteBuckets={[]}
      showKey
      {...props}
    />
  ));

  test('basic layout', () => {
    const component = renderRegistrationPolicyEditor();
    expect(component.find(RegistrationBucketRow).length).toEqual(1);
    expect(component.find('ul button').length).toEqual(2);
  });

  describe('with presets', () => {
    test('renders the selector by default', () => {
      const component = renderRegistrationPolicyEditor({ presets: defaultPresets });
      expect(component.find('select').length).toEqual(1);
      expect(component.find('select option').length).toEqual(5); // number of presets + blank + custom
      expect(component.find(RegistrationBucketRow).length).toEqual(0);
      expect(component.find('ul button').length).toEqual(0);
    });
  });
});
