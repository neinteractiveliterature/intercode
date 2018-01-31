import React from 'react';
import { mount } from 'enzyme';
import { ConfirmModal } from 'react-bootstrap4-modal';
import { BrowserRouter, Link } from 'react-router-dom';
import CommonEventFormFields from '../../../app/javascript/BuiltInForms/CommonEventFormFields';
import EventForm from '../../../app/javascript/BuiltInForms/EventForm';

describe('EventForm', () => {
  const defaultProps = {
    initialEvent: {
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
      maximum_event_provided_tickets_overrides: [],
    },
    onSave: () => {},
    onDrop: () => {},
    ticketTypes: [],
    createMaximumEventProvidedTicketsOverride: () => {},
    deleteMaximumEventProvidedTicketsOverride: () => {},
    updateMaximumEventProvidedTicketsOverride: () => {},
  };

  const buildEventForm = props => ((
    <EventForm
      {...defaultProps}
      {...props}
    />
  ));

  const renderEventForm = props => mount(buildEventForm(props));

  test('it renders a CommonEventFormFields', () => {
    const component = renderEventForm();
    expect(component.find(CommonEventFormFields).length).toEqual(1);
  });

  describe('header text', () => {
    test('new event', () => {
      const component = renderEventForm({
        initialEvent: {
          ...defaultProps.initialEvent,
          id: null,
        },
      });

      expect(component.find('header').text()).toEqual('New event');
    });

    test('edit event', () => {
      const component = renderEventForm({
        initialEvent: {
          ...defaultProps.initialEvent,
          id: 1,
        },
      });

      expect(component.find('header').text()).toEqual('Edit event');
    });
  });

  test('error rendering', () => {
    const component = renderEventForm({ error: 'blah' });
    expect(component.find('.alert-danger').text()).toEqual('blah');
  });

  test('field changes', () => {
    const component = renderEventForm();
    component.find('input').filter({ name: 'title' }).simulate('change', {
      target: { name: 'title', value: 'something' },
    });
    expect(component.instance().state.event.title).toEqual('something');
  });

  describe('saving', () => {
    test('enabling the save button requires a title and lengthSeconds', () => {
      const incompleteComponent = renderEventForm();
      expect((
        incompleteComponent.find('.btn-primary').filterWhere(button => button.text() === 'Save event')
          .prop('disabled')
      )).toBeTruthy();

      const completeComponent = renderEventForm({
        initialEvent: {
          ...defaultProps.initialEvent, title: 'something', length_seconds: 60,
        },
      });
      expect((
        completeComponent.find('.btn-primary').filterWhere(button => button.text() === 'Save event')
          .prop('disabled')
      )).toBeFalsy();
    });

    test('onSave callback', () => {
      const onSave = jest.fn();
      const component = renderEventForm({
        onSave,
        initialEvent: {
          ...defaultProps.initialEvent, title: 'something', length_seconds: 60,
        },
      });
      component.find('.btn-primary').filterWhere(button => button.text() === 'Save event').simulate('click');
      expect(onSave.mock.calls[0][0].length_seconds).toEqual(60);
    });
  });

  describe('drop event workflow', () => {
    test('no drop button by default', () => {
      const component = renderEventForm();
      expect(component.find('.btn-outline-danger').length).toEqual(0);
    });

    test('showDropButton gets it to render a drop button', () => {
      const component = renderEventForm({ showDropButton: true });
      expect(component.find('.btn-outline-danger').length).toEqual(1);
    });

    test('if the event is already dropped, the drop button does not show up', () => {
      const component = renderEventForm({
        initialEvent: {
          ...defaultProps.initialEvent,
          status: 'dropped',
        },
        showDropButton: true,
      });
      expect(component.find('.btn-outline-danger').length).toEqual(0);
    });

    test('if the event is not yet saved, the drop button does not show up', () => {
      const component = renderEventForm({
        initialEvent: {
          ...defaultProps.initialEvent,
          id: null,
        },
        showDropButton: true,
      });
      expect(component.find('.btn-outline-danger').length).toEqual(0);
    });

    test('dropping the event', () => {
      const onDrop = jest.fn();
      const component = renderEventForm({ showDropButton: true, onDrop });
      component.find('.btn-outline-danger').simulate('click');
      expect(component.find(ConfirmModal).prop('visible')).toBeTruthy();
      component.find(ConfirmModal).find('.btn-primary').simulate('click');
      expect(onDrop.mock.calls.length).toEqual(1);
    });

    test('canceling the drop', () => {
      const onDrop = jest.fn();
      const component = renderEventForm({ showDropButton: true, onDrop });
      component.find('.btn-outline-danger').simulate('click');
      expect(component.find(ConfirmModal).prop('visible')).toBeTruthy();
      component.find(ConfirmModal).find('.btn-secondary').simulate('click');
      expect(onDrop.mock.calls.length).toEqual(0);
      expect(component.find(ConfirmModal).prop('visible')).toBeFalsy();
    });
  });

  describe('cancel link', () => {
    test('no cancel link by default', () => {
      const component = renderEventForm();
      expect(component.find(Link).length).toEqual(0);
    });

    test('passing a cancelPath makes a cancel link show up', () => {
      const component = mount((
        <BrowserRouter>
          {buildEventForm({ cancelPath: '/' })}
        </BrowserRouter>
      ));
      expect(component.find(Link).length).toEqual(1);
    });
  });
});
