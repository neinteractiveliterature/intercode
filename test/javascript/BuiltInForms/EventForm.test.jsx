import React from 'react';
import { mount } from 'enzyme';
import CommonEventFormFields from '../../../app/javascript/BuiltInForms/CommonEventFormFields';
import EventForm from '../../../app/javascript/BuiltInForms/EventForm';

describe('EventForm', () => {
  const renderEventForm = props => mount((
    <EventForm
      initialEvent={{
        id: 123,
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
      }}
      onSave={() => {}}
      onDrop={() => {}}
      {...props}
    />
  ));

  test('it renders a CommonEventFormFields', () => {
    const component = renderEventForm();
    expect(component.find(CommonEventFormFields).length).toEqual(1);
  });
});
