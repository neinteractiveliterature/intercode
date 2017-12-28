import React from 'react';
import { mount } from 'enzyme';
import { ConfirmModal } from 'react-bootstrap4-modal';
import { BrowserRouter, Link } from 'react-router-dom';
import CommonEventFormFields from '../../../app/javascript/BuiltInForms/CommonEventFormFields';
import RunFormFields from '../../../app/javascript/BuiltInForms/RunFormFields';
import FillerEventForm from '../../../app/javascript/BuiltInForms/FillerEventForm';

describe('FillerEventForm', () => {
  const defaultProps = {
    initialEvent: {
      id: 123,
      category: 'filler',
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
      runs: [],
    },
    convention: {
      starts_at: '2017-01-01T00:00:00Z',
      ends_at: '2017-01-02T00:00:00Z',
      timezone_name: 'UTC',
      rooms: [
        {
          id: 1,
          name: 'A Room With A View',
        },
        {
          id: 2,
          name: "A Room Of One's Own",
        },
      ],
    },
    onSave: () => {},
  };

  const buildFillerEventForm = props => ((
    <FillerEventForm
      {...defaultProps}
      {...props}
    />
  ));

  const renderFillerEventForm = props => mount(buildFillerEventForm(props));

  test('it renders a CommonEventFormFields', () => {
    const component = renderFillerEventForm();
    expect(component.find(CommonEventFormFields).length).toEqual(1);
  });

  describe('rendering the RunFormFields', () => {
    test('it does not render by default', () => {
      const component = renderFillerEventForm();
      expect(component.find(RunFormFields).length).toEqual(0);
    });

    test('it renders if the event has a length', () => {
      const component = renderFillerEventForm({
        initialEvent: {
          ...defaultProps.initialEvent,
          length_seconds: 3600,
        },
      });
      expect(component.find(RunFormFields).length).toEqual(1);
    });
  });

  describe('save button text', () => {
    test('new event', () => {
      const component = renderFillerEventForm({
        initialEvent: {
          ...defaultProps.initialEvent,
          id: null,
        },
      });

      expect(component.find('.btn-primary').text()).toEqual('Create filler event');
    });

    test('edit event', () => {
      const component = renderFillerEventForm({
        initialEvent: {
          ...defaultProps.initialEvent,
          id: 1,
        },
      });

      expect(component.find('.btn-primary').text()).toEqual('Save filler event');
    });
  });

  test('error rendering', () => {
    const component = renderFillerEventForm({ error: 'blah' });
    expect(component.find('.alert-danger').text()).toEqual('blah');
  });

  test('field changes', () => {
    const component = renderFillerEventForm();
    component.find('input').filter({ name: 'title' }).simulate('change', {
      target: { name: 'title', value: 'something' },
    });
    expect(component.instance().state.event.title).toEqual('something');
  });

  describe('saving', () => {
    test('enabling the save button requires a title, lengthSeconds, and run start', () => {
      const incompleteComponent = renderFillerEventForm();
      expect(incompleteComponent.find('.btn-primary').prop('disabled')).toBeTruthy();

      const completeComponent = renderFillerEventForm({
        initialEvent: {
          ...defaultProps.initialEvent,
          title: 'something',
          length_seconds: 60,
          runs: [
            { starts_at: '2017-01-01T06:00:00Z', rooms: [] },
          ],
        },
      });
      expect(completeComponent.find('.btn-primary').prop('disabled')).toBeFalsy();
    });

    test('onSave callback', () => {
      const onSave = jest.fn();
      const component = renderFillerEventForm({
        onSave,
        initialEvent: {
          ...defaultProps.initialEvent,
          title: 'something',
          length_seconds: 60,
          runs: [
            { starts_at: '2017-01-01T06:00:00Z', rooms: [] },
          ],
        },
      });
      component.find('.btn-primary').simulate('click');
      expect(onSave.mock.calls[0][0].event.length_seconds).toEqual(60);
      expect(onSave.mock.calls[0][0].run.starts_at).toEqual('2017-01-01T06:00:00Z');
    });
  });

  describe('cancel link', () => {
    test('no cancel link by default', () => {
      const component = renderFillerEventForm();
      expect(component.find(Link).length).toEqual(0);
    });

    test('passing a cancelPath makes a cancel link show up', () => {
      const component = mount((
        <BrowserRouter>
          {buildFillerEventForm({ cancelPath: '/' })}
        </BrowserRouter>
      ));
      expect(component.find(Link).length).toEqual(1);
    });
  });
});
