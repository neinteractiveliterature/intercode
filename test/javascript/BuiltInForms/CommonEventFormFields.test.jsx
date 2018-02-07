import React from 'react';
import { mount } from 'enzyme';
import BootstrapFormCheckbox from '../../../app/javascript/BuiltInFormControls/BootstrapFormCheckbox';
import BootstrapFormInput from '../../../app/javascript/BuiltInFormControls/BootstrapFormInput';
import BootstrapFormTextarea from '../../../app/javascript/BuiltInFormControls/BootstrapFormTextarea';
import CommonEventFormFields from '../../../app/javascript/BuiltInForms/CommonEventFormFields';
import RegistrationPolicyEditor from '../../../app/javascript/BuiltInFormControls/RegistrationPolicyEditor';
import TimespanItem from '../../../app/javascript/FormPresenter/components/TimespanItem';

describe('CommonEventFormFields', () => {
  const renderCommonEventFormFields = (props, eventProps) => mount((
    <CommonEventFormFields
      event={{
        category: 'larp',
        title: '',
        author: '',
        email: '',
        organization: '',
        con_mail_destination: 'gms',
        url: '',
        short_blurb: '',
        description: '',
        participant_communications: '',
        can_play_concurrently: false,
        maximum_event_provided_tickets_overrides: [],
        ...eventProps,
      }}
      ticketTypes={[]}
      onChange={() => {}}
      createMaximumEventProvidedTicketsOverride={() => {}}
      deleteMaximumEventProvidedTicketsOverride={() => {}}
      updateMaximumEventProvidedTicketsOverride={() => {}}
      {...props}
    />
  ));

  test('it renders values correctly', () => {
    const registrationPolicy = {
      buckets: [
        {
          key: 'players',
          name: 'Players',
          description: 'Players for this larp',
          slots_limited: true,
          anything: false,
          minimum_slots: 20,
          preferred_slots: 25,
          total_slots: 30,
        },
      ],
      prevent_no_preference_signups: false,
    };

    const component = renderCommonEventFormFields({}, {
      title: 'myTitle',
      author: 'myAuthor',
      email: 'myEmail',
      organization: 'myOrganization',
      con_mail_destination: 'event_email',
      url: 'myUrl',
      short_blurb: 'myShortBlurb',
      description: 'myDescription',
      participant_communications: 'myParticipantCommunications',
      length_seconds: 3600,
      registration_policy: registrationPolicy,
      can_play_concurrently: true,
    });

    expect(component.find(BootstrapFormInput).filter({ name: 'title' }).prop('value')).toEqual('myTitle');
    expect(component.find(BootstrapFormInput).filter({ name: 'author' }).prop('value')).toEqual('myAuthor');
    expect(component.find(BootstrapFormInput).filter({ name: 'email' }).prop('value')).toEqual('myEmail');
    expect(component.find(BootstrapFormInput).filter({ name: 'organization' }).prop('value')).toEqual('myOrganization');
    expect(component.find(BootstrapFormCheckbox).filter({ name: 'con_mail_destination', value: 'event_email' }).prop('checked')).toBeTruthy();
    expect(component.find(BootstrapFormInput).filter({ name: 'url' }).prop('value')).toEqual('myUrl');
    expect(component.find(BootstrapFormTextarea).filter({ name: 'short_blurb' }).prop('value')).toEqual('myShortBlurb');
    expect(component.find(BootstrapFormTextarea).filter({ name: 'description' }).prop('value')).toEqual('myDescription');
    expect(component.find(BootstrapFormTextarea).filter({ name: 'participant_communications' }).prop('value')).toEqual('myParticipantCommunications');
    expect(component.find(TimespanItem).prop('value')).toEqual(3600);
    expect(component.find(RegistrationPolicyEditor).prop('registrationPolicy').getAPIRepresentation()).toEqual(registrationPolicy);
    expect(component.find(BootstrapFormCheckbox).filter({ name: 'can_play_concurrently', value: 'true' }).prop('checked')).toBeTruthy();
  });

  test('it calls the length_seconds field "Length"', () => {
    const component = renderCommonEventFormFields();
    expect(component.find(TimespanItem).prop('formItem').properties.caption).toEqual('Length');
  });

  describe('componentWillReceiveProps', () => {
    test('it rebuilds the registration policy', () => {
      const component = renderCommonEventFormFields();
      component.instance().componentWillReceiveProps({
        event: {
          registration_policy: CommonEventFormFields.buildRegistrationPolicyForVolunteerEvent(5),
        },
      });

      expect(component.instance().state.registrationPolicy.getBucket('signups').get('totalSlots')).toEqual(5);
    });
  });

  describe('changing inputs', () => {
    test('formInputDidChange', () => {
      const onChange = jest.fn();
      const component = renderCommonEventFormFields({ onChange });
      component.find('input').filter({ name: 'title' }).simulate('change', {
        target: {
          name: 'title',
          value: 'a new title',
        },
      });
      expect(onChange.mock.calls[0][0].title).toEqual('a new title');
    });

    test('canPlayConcurrentlyDidChange', () => {
      const onChange = jest.fn();
      const component = renderCommonEventFormFields({ onChange });
      component.find('input').filter({ name: 'can_play_concurrently', value: 'true' }).simulate('change', {
        target: {
          name: 'can_play_concurrently',
          value: 'true',
        },
      });
      expect(onChange.mock.calls[0][0].can_play_concurrently).toEqual(true);
    });

    test('registrationPolicyDidChange', () => {
      const onChange = jest.fn();
      const component = renderCommonEventFormFields({ onChange });
      component.find(RegistrationPolicyEditor).find('select').simulate('change', {
        target: {
          value: 'Limited slots by gender (classic Intercon-style)',
        },
      });
      expect(onChange.mock.calls[0][0].registration_policy.buckets.length).toEqual(3);
    });

    test('totalSlotsForVolunteerEventDidChange', () => {
      const onChange = jest.fn();
      const component = renderCommonEventFormFields({ onChange }, {
        category: 'volunteer_event',
        registration_policy: CommonEventFormFields.buildRegistrationPolicyForVolunteerEvent(5),
      });
      component.find('input').filter({ name: 'total_slots' }).simulate('change', {
        target: {
          name: 'total_slots',
          value: '15',
        },
      });
      expect(onChange.mock.calls[0][0].registration_policy.buckets[0].total_slots).toEqual(15);
    });
  });

  describe('volunteer events', () => {
    const component = renderCommonEventFormFields({}, {
      category: 'volunteer_event',
      registration_policy: CommonEventFormFields.buildRegistrationPolicyForVolunteerEvent(5),
    });

    test('it has no can_play_concurrently control', () => {
      expect(component.find(BootstrapFormCheckbox).filter({ name: 'can_play_concurrently' }).length).toEqual(0);
    });

    test('it renders a simple numeric input instead of registration policy', () => {
      expect(component.find(BootstrapFormInput).filter({ name: 'total_slots' }).prop('value')).toEqual('5');
      expect(component.find(RegistrationPolicyEditor).length).toEqual(0);
    });

    test('it calls the length_seconds field differently', () => {
      expect(component.find(TimespanItem).prop('formItem').properties.caption).toEqual('Length of each run');
    });

    test('it has none of the regular-event-only fields', () => {
      ['author', 'organization', 'url', 'participant_communications', 'con_mail_destination'].forEach((field) => {
        expect(component.find({ name: field }).length).toEqual(0);
      });
    });
  });
});
