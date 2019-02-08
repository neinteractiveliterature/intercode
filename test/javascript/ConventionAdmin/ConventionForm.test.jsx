import React from 'react';
import { shallow } from 'enzyme';
import moment from 'moment-timezone';

import BooleanInput from '../../../app/javascript/BuiltInFormControls/BooleanInput';
import BootstrapFormInput from '../../../app/javascript/BuiltInFormControls/BootstrapFormInput';
import ConventionForm from '../../../app/javascript/ConventionAdmin/ConventionForm';
import DateTimeInput from '../../../app/javascript/BuiltInFormControls/DateTimeInput';
import MultipleChoiceInput from '../../../app/javascript/BuiltInFormControls/MultipleChoiceInput';
import ScheduledValueEditor from '../../../app/javascript/BuiltInFormControls/ScheduledValueEditor';
import TimezoneSelect from '../../../app/javascript/BuiltInFormControls/TimezoneSelect';

describe('ConventionForm', () => {
  const defaultInitialConvention = {
    starts_at: '',
    ends_at: '',
    name: '',
    domain: '',
    timezone_name: '',
    accepting_proposals: false,
    show_schedule: 'no',
    show_event_list: 'no',
    maximum_event_signups: {
      timespans: [
        { start: null, finish: null, value: 'unlimited' },
      ],
    },
    maximum_tickets: null,
    ticket_name: 'ticket',
    default_layout_id: null,
    root_page_id: null,
  };

  const renderConventionForm = (props, initialConventionProps) => shallow((
    <ConventionForm
      initialConvention={{ ...defaultInitialConvention, ...initialConventionProps }}
      saveConvention={() => {}}
      cmsLayouts={[]}
      pages={[]}
      {...props}
    />
  ));

  test('it renders the given values', () => {
    const now = moment.tz({}, 'UTC').toISOString();
    const component = renderConventionForm({}, {
      starts_at: now,
      ends_at: now,
      name: 'myName',
      domain: 'myDomain',
      timezone_name: 'UTC',
      accepting_proposals: true,
      show_schedule: 'gms',
      maximum_event_signups: {
        timespans: [
          { start: null, finish: now, value: 'not_yet' },
          { start: now, finish: null, value: 'unlimited' },
        ],
      },
      maximum_tickets: 100,
    });

    expect(component.find(DateTimeInput).at(0).prop('value')).toEqual(now);
    expect(component.find(DateTimeInput).at(1).prop('value')).toEqual(now);
    expect(component.find(BootstrapFormInput).filter({ name: 'name' }).prop('value')).toEqual('myName');
    expect(component.find(BootstrapFormInput).filter({ name: 'domain' }).prop('value')).toEqual('myDomain');
    expect(component.find(TimezoneSelect).prop('value')).toEqual('UTC');
    expect(component.find(BooleanInput).filter({ name: 'accepting_proposals' }).prop('value')).toBeTruthy();
    expect(component.find(MultipleChoiceInput).filter({ name: 'show_schedule' }).prop('value')).toEqual('gms');
    expect(component.find(BootstrapFormInput).filter({ name: 'maximum_tickets' }).prop('value')).toEqual('100');

    expect(component.find(ScheduledValueEditor).prop('scheduledValue')).toEqual({
      timespans: [
        { start: null, finish: now, value: 'not_yet' },
        { start: now, finish: null, value: 'unlimited' },
      ],
    });
  });

  test('mutating form fields', () => {
    const component = renderConventionForm();
    component.find(BooleanInput).filter({ name: 'accepting_proposals' })
      .prop('onChange')(true);
    expect(component.instance().state.convention.accepting_proposals).toBeTruthy();
  });

  test('onClickSave', () => {
    const saveConvention = jest.fn();
    const component = renderConventionForm({ saveConvention });
    component.find('.btn-primary').simulate('click', { preventDefault: () => {} });
    expect(saveConvention.mock.calls[0][0]).toEqual(defaultInitialConvention);
  });
});
