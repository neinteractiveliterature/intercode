import React from 'react';
import { shallow } from 'enzyme';
import BootstrapFormInput from '../../../app/javascript/BuiltInFormControls/BootstrapFormInput';
import UserConProfileSelect from '../../../app/javascript/BuiltInFormControls/UserConProfileSelect';
import StaffPositionForm from '../../../app/javascript/BuiltInForms/StaffPositionForm';

describe('StaffPositionForm', () => {
  const renderStaffPositionForm = props => shallow((
    <StaffPositionForm
      baseUrl="/staff_positions"
      initialStaffPosition={{}}
      {...props}
    />
  ));

  test('it renders the given values', () => {
    const component = renderStaffPositionForm({
      initialStaffPosition: {
        name: 'myName',
        email: 'staffposition@examplecon.example.com',
        user_con_profile_ids: [1, 2, 3],
      },
    });

    expect(component.find(BootstrapFormInput).filter({ name: 'name' }).prop('value')).toEqual('myName');
    expect(component.find(BootstrapFormInput).filter({ name: 'email' }).prop('value')).toEqual('staffposition@examplecon.example.com');
    expect(component.find(UserConProfileSelect).prop('value')).toEqual([1, 2, 3]);
  });

  test.skip('saving', () => {
    // not testing saving for now because this is a ResourceForm;
    // we'll test it once this moves to apollo
  });
});
