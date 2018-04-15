import React from 'react';
import { mount } from 'enzyme';
import { ConfirmModal } from 'react-bootstrap4-modal';
import InPlaceEditor from '../../../app/javascript/BuiltInFormControls/InPlaceEditor';
import RegistrationPolicyBucket from '../../../app/javascript/Models/RegistrationPolicyBucket';
import RegistrationBucketRow from '../../../app/javascript/BuiltInFormControls/RegistrationBucketRow';

describe('RegistrationBucketRow', () => {
  let onChange;
  let onDelete;

  const defaultRegistrationBucketProps = {
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
    onChange = jest.fn();
    onDelete = jest.fn();
  });

  const renderRegistrationBucketRow = (props, registrationBucketProps) => mount((
    <table>
      <tbody>
        <RegistrationBucketRow
          registrationBucket={
            new RegistrationPolicyBucket({
              ...defaultRegistrationBucketProps,
              ...registrationBucketProps,
            })
          }
          onChange={onChange}
          onDelete={onDelete}
          lockNameAndDescription={false}
          lockLimited={false}
          lockDelete={false}
          {...props}
        />
      </tbody>
    </table>
  ));

  test('it renders the correct field values', () => {
    const component = renderRegistrationBucketRow();
    expect(component.find('.anything-bucket').length).toEqual(0);
    expect(component.find('td').at(0).text()).toEqual('test');
    expect(component.find('td').at(1).text()).toEqual('a bucket for testing');
    expect(component.find('td').at(2).find('input[type="checkbox"]').at(0)
      .prop('checked')).toBeFalsy(); // unlimited
    expect(component.find('td').at(2).find('input[type="checkbox"]').at(1)
      .prop('checked')).toBeTruthy(); // counted
    expect(component.find('td').at(2).find('input[type="number"]').map(input => input.prop('value'))).toEqual([
      2,
      5,
      10,
    ]);
  });

  test('lockNameAndDescription', () => {
    const component = renderRegistrationBucketRow({ lockNameAndDescription: true });
    expect(component.find('.anything-bucket').length).toEqual(0);
    expect(component.find('td').at(0).text()).toEqual('test');
    expect(component.find('td').at(0).prop('title')).toEqual('a bucket for testing');
    expect(component.find('td').at(1).find('input[type="checkbox"]').at(0)
      .prop('checked')).toBeFalsy(); // unlimited
    expect(component.find('td').at(1).find('input[type="checkbox"]').at(1)
      .prop('checked')).toBeTruthy(); // counted
    expect(component.find('td').at(1).find('input[type="number"]').map(input => input.prop('value'))).toEqual([
      2,
      5,
      10,
    ]);
  });

  test('lockLimited', () => {
    const component = renderRegistrationBucketRow({ lockLimited: true });
    expect(component.find('.anything-bucket').length).toEqual(0);
    expect(component.find('td').at(0).text()).toEqual('test');
    expect(component.find('td').at(1).text()).toEqual('a bucket for testing');
    expect(component.find('td').at(2).find('input[type="checkbox"]').length).toEqual(0);
    expect(component.find('td').at(2).find('input[type="number"]').map(input => input.prop('value'))).toEqual([
      2,
      5,
      10,
    ]);
  });

  test('lockDelete', () => {
    const component = renderRegistrationBucketRow({ lockDelete: true });
    expect(component.find('.anything-bucket').length).toEqual(0);
    expect(component.find('td').at(3).find('button').length).toEqual(0);
  });

  test('anything bucket renders properly', () => {
    const component = renderRegistrationBucketRow({}, { anything: true });
    expect(component.find('.anything-bucket').length).toEqual(1);
  });

  test('changing the name', () => {
    const component = renderRegistrationBucketRow();
    component.find('td').at(0).find(InPlaceEditor).prop('onChange')('new name');
    expect(onChange.mock.calls[0][0]).toEqual('testBucket');
    expect(onChange.mock.calls[0][1].get('name')).toEqual('new name');
    expect(onChange.mock.calls[0][1].get('key')).toEqual('testBucket');
  });

  test('changing the description', () => {
    const component = renderRegistrationBucketRow();
    component.find('td').at(1).find(InPlaceEditor).prop('onChange')('a new description');
    expect(onChange.mock.calls[0][0]).toEqual('testBucket');
    expect(onChange.mock.calls[0][1].get('description')).toEqual('a new description');
  });

  test('changing unlimited checkbox', () => {
    const component = renderRegistrationBucketRow();
    component.find('td').at(2).find('input[type="checkbox"]').at(0)
      .simulate('change', { target: { checked: true } });
    expect(onChange.mock.calls[0][0]).toEqual('testBucket');
    expect(onChange.mock.calls[0][1].get('slotsLimited')).toEqual(false);
  });

  test('changing counted checkbox', () => {
    const component = renderRegistrationBucketRow();
    component.find('td').at(2).find('input[type="checkbox"]').at(1)
      .simulate('change', { target: { checked: false } });
    expect(onChange.mock.calls[0][0]).toEqual('testBucket');
    expect(onChange.mock.calls[0][1].get('notCounted')).toEqual(true);
  });

  test('changing minimumSlots', () => {
    const component = renderRegistrationBucketRow();
    component.find('td').at(2).find('input[type="number"]').at(0)
      .simulate('change', { target: { value: 4 } });
    expect(onChange.mock.calls[0][0]).toEqual('testBucket');
    expect(onChange.mock.calls[0][1].get('minimumSlots')).toEqual(4);
  });

  test('changing preferredSlots', () => {
    const component = renderRegistrationBucketRow();
    component.find('td').at(2).find('input[type="number"]').at(1)
      .simulate('change', { target: { value: 6 } });
    expect(onChange.mock.calls[0][0]).toEqual('testBucket');
    expect(onChange.mock.calls[0][1].get('preferredSlots')).toEqual(6);
  });

  test('changing totalSlots', () => {
    const component = renderRegistrationBucketRow();
    component.find('td').at(2).find('input[type="number"]').at(2)
      .simulate('change', { target: { value: 55 } });
    expect(onChange.mock.calls[0][0]).toEqual('testBucket');
    expect(onChange.mock.calls[0][1].get('totalSlots')).toEqual(55);
  });

  test('deleting', () => {
    const component = renderRegistrationBucketRow();
    component.find('td').at(3).find('button').at(0)
      .simulate('click');
    component.find(ConfirmModal).find('button').at(1).simulate('click');
    expect(onDelete.mock.calls[0][0]).toEqual('testBucket');
  });

  test('canceling delete', () => {
    const component = renderRegistrationBucketRow();
    component.find('td').at(3).find('button').at(0)
      .simulate('click');
    component.find(ConfirmModal).find('button').at(0).simulate('click');
    expect(onDelete.mock.calls[0]).toBeFalsy();
  });
});
