import React from 'react';
import { shallow } from 'enzyme';
import EventForm from '../../../app/javascript/BuiltInForms/EventForm';
import EditEvent from '../../../app/javascript/BuiltInForms/EditEvent';

describe('EditEvent', () => {
  const renderEditEvent = props => shallow((
    <EditEvent
      event={{
        id: 123,
        registration_policy: {
          buckets: [
            { total_slots: 1 },
          ],
        },
      }}
      updateEvent={() => {}}
      dropEvent={() => {}}
      onSave={() => {}}
      onDrop={() => {}}
      cancelPath={null}
      showDropButton={false}
      {...props}
    />
  ));

  test('it renders an EventForm', () => {
    const component = renderEditEvent();
    expect(component.find(EventForm).length).toEqual(1);
  });

  describe('updateEvent', () => {
    test('happy path', async () => {
      const updateEvent = jest.fn();
      const onSave = jest.fn();
      const component = renderEditEvent({ updateEvent, onSave });

      await component.instance().updateEvent(component.instance().props.event);

      expect(updateEvent.mock.calls.length).toEqual(1);
      expect(updateEvent.mock.calls[0][0].variables.input.id).toEqual(123);
      expect(onSave.mock.calls.length).toEqual(1);
    });

    test('unhappy path', async () => {
      const error = new Error('bad mojo');
      const updateEvent = jest.fn(() => { throw error; });
      const onSave = jest.fn();
      const component = renderEditEvent({ updateEvent, onSave });

      await component.instance().updateEvent(component.instance().props.event);

      expect(updateEvent.mock.calls.length).toEqual(1);
      expect(onSave.mock.calls.length).toEqual(0);
      expect(component.instance().state.error).toEqual(error);
    });
  });

  describe('dropEvent', () => {
    test('happy path', async () => {
      const dropEvent = jest.fn();
      const onDrop = jest.fn();
      const component = renderEditEvent({ dropEvent, onDrop });

      await component.instance().dropEvent();

      expect(dropEvent.mock.calls.length).toEqual(1);
      expect(dropEvent.mock.calls[0]).toEqual([{ variables: { input: { id: 123 } } }]);
      expect(onDrop.mock.calls.length).toEqual(1);
    });

    test('unhappy path', async () => {
      const error = new Error('bad mojo');
      const dropEvent = jest.fn(() => { throw error; });
      const onDrop = jest.fn();
      const component = renderEditEvent({ dropEvent, onDrop });

      await component.instance().dropEvent();

      expect(dropEvent.mock.calls.length).toEqual(1);
      expect(onDrop.mock.calls.length).toEqual(0);
      expect(component.instance().state.error).toEqual(error);
    });
  });
});
