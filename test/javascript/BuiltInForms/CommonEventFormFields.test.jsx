import React from 'react';
import { mount } from 'enzyme';
import { ApolloProvider } from 'react-apollo';
import BootstrapFormCheckbox from '../../../app/javascript/BuiltInFormControls/BootstrapFormCheckbox';
import BootstrapFormInput from '../../../app/javascript/BuiltInFormControls/BootstrapFormInput';
import CommonEventFormFields from '../../../app/javascript/BuiltInForms/CommonEventFormFields';
import formFromExportJSON from '../formFromExportJSON';
import FreeTextItem from '../../../app/javascript/FormPresenter/components/FreeTextItem';
import MultipleChoiceItem from '../../../app/javascript/FormPresenter/components/MultipleChoiceItem';
import RegistrationPolicyEditor from '../../../app/javascript/BuiltInFormControls/RegistrationPolicyEditor';
import TimespanItem from '../../../app/javascript/FormPresenter/components/TimespanItem';

import RegularEventForm from '../../../cms_content_sets/standard/forms/regular_event_form.json';

describe('CommonEventFormFields', () => {
  const renderCommonEventFormFields = (props, eventProps) => mount((
    <ApolloProvider client={{ query: () => {} }}>
      <CommonEventFormFields
        event={{
          form_response_attrs: {
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
            ...eventProps,
          },
          maximum_event_provided_tickets_overrides: [],
        }}
        convention={{
          starts_at: '2017-01-01T00:00:00Z',
          ends_at: '2017-01-03T00:00:00Z',
          timezone_name: 'UTC',
        }}
        form={formFromExportJSON(RegularEventForm)}
        ticketTypes={[]}
        onChange={() => {}}
        createMaximumEventProvidedTicketsOverride={() => {}}
        deleteMaximumEventProvidedTicketsOverride={() => {}}
        updateMaximumEventProvidedTicketsOverride={() => {}}
        {...props}
      />
    </ApolloProvider>
  ));

  test.only('it renders values correctly', () => {
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

    expect(component.find(FreeTextItem).filterWhere(node => node.prop('formItem').identifier === 'title').prop('value')).toEqual('myTitle');
    expect(component.find(FreeTextItem).filterWhere(node => node.prop('formItem').identifier === 'author').prop('value')).toEqual('myAuthor');
    expect(component.find(FreeTextItem).filterWhere(node => node.prop('formItem').identifier === 'email').prop('value')).toEqual('myEmail');
    expect(component.find(FreeTextItem).filterWhere(node => node.prop('formItem').identifier === 'organization').prop('value')).toEqual('myOrganization');
    expect(component.find(MultipleChoiceItem).filterWhere(node => node.prop('formItem').identifier === 'con_mail_destination').prop('value')).toEqual('event_email');
    expect(component.find(FreeTextItem).filterWhere(node => node.prop('formItem').identifier === 'url').prop('value')).toEqual('myUrl');
    expect(component.find(FreeTextItem).filterWhere(node => node.prop('formItem').identifier === 'short_blurb').prop('value')).toEqual('myShortBlurb');
    expect(component.find(FreeTextItem).filterWhere(node => node.prop('formItem').identifier === 'description').prop('value')).toEqual('myDescription');
    expect(component.find(FreeTextItem).filterWhere(node => node.prop('formItem').identifier === 'participant_communications').prop('value')).toEqual('myParticipantCommunications');
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
      component.find(FreeTextItem).filter({ name: 'title' }).simulate('change', {
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
      component.find(FreeTextItem).filter({ name: 'can_play_concurrently', value: 'true' }).simulate('change', {
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
      component.find(FreeTextItem).filter({ name: 'total_slots' }).simulate('change', {
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
