import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import * as formMockData from '../EventAdmin/formMockData';
import EditEvent from '../../../app/javascript/BuiltInForms/EditEvent';
import useEventForm, { EventForm } from '../../../app/javascript/EventAdmin/useEventForm';
import {
  render, fireEvent, waitFor, act,
} from '../testUtils';

const defaultProps = {
  updateEvent: () => { },
  onSave: () => { },
};

function EditEventTester({
  // eslint-disable-next-line react/prop-types
  convention, initialEvent, eventForm, ...props
}) {
  const [formProps, { event, validateForm }] = useEventForm({
    convention: convention || formMockData.convention,
    initialEvent: initialEvent || formMockData.initialEvent,
    eventForm: eventForm || formMockData.minimalForm,
  });
  return (
    <BrowserRouter basename="/">
      <EditEvent event={event} validateForm={validateForm} {...defaultProps} {...props}>
        <EventForm {...formProps} />
      </EditEvent>
    </BrowserRouter>
  );
}

describe('EditEvent', () => {
  const renderEditEvent = (overrideProps = {}) => render(<EditEventTester {...overrideProps} />);

  describe('header text', () => {
    test('edit event', () => {
      const { getByText } = renderEditEvent();
      expect(getByText('Edit event').tagName).toEqual('H3');
    });

    test('new event', () => {
      const { getByText } = renderEditEvent({
        initialEvent: { ...formMockData.initialEvent, id: null },
      });
      expect(getByText('New event').tagName).toEqual('H3');
    });
  });

  describe('saving', () => {
    test('the save button validates the form', async () => {
      const updateEvent = jest.fn();
      const onSave = jest.fn();
      const { getByText, getByLabelText } = renderEditEvent({ updateEvent, onSave });
      await act(async () => {
        fireEvent.click(getByText('Save event'));
        await waitFor(() => expect(getByLabelText('Title*')).toHaveClass('is-invalid'));
      });
      expect(updateEvent).not.toHaveBeenCalled();
      expect(onSave).not.toHaveBeenCalled();
    });

    test('the save button updates the event and calls onSave', async () => {
      const updateEvent = jest.fn();
      const onSave = jest.fn();
      const { getByText } = renderEditEvent({
        updateEvent,
        onSave,
        initialEvent: {
          ...formMockData.initialEvent,
          form_response_attrs: { title: 'An event' },
        },
      });
      await act(async () => {
        fireEvent.click(getByText('Save event'));
        await waitFor(() => expect(updateEvent).toHaveBeenCalled());
      });
      expect(onSave).toHaveBeenCalled();
    });

    test('if the save fails, it displays the error and does not call onSave', async () => {
      const updateEvent = jest.fn(() => { throw new Error('blahhhh'); });
      const onSave = jest.fn();
      const { getByText } = renderEditEvent({
        updateEvent,
        onSave,
        initialEvent: {
          ...formMockData.initialEvent,
          form_response_attrs: { title: 'An event' },
        },
      });
      await act(async () => {
        fireEvent.click(getByText('Save event'));
        await waitFor(() => expect(getByText('blahhhh')).toBeVisible());
      });
      expect(updateEvent).toHaveBeenCalled();
      expect(onSave).not.toHaveBeenCalled();
    });
  });

  describe('drop event workflow', () => {
    test('no drop button by default', () => {
      const { queryByText } = renderEditEvent();
      expect(queryByText('Drop event')).toBeNull();
    });

    test('showDropButton gets it to render a drop button', () => {
      const { queryAllByText } = renderEditEvent({ showDropButton: true });
      expect(queryAllByText('Drop event')).toHaveLength(1);
    });

    test('if the event is already dropped, the drop button does not show up', () => {
      const { queryByText } = renderEditEvent({
        showDropButton: true,
        initialEvent: { ...formMockData.initialEvent, status: 'dropped' },
      });
      expect(queryByText('Drop event')).toBeNull();
    });

    test('if the event is not yet saved, the drop button does not show up', () => {
      const { queryByText } = renderEditEvent({
        showDropButton: true,
        initialEvent: { ...formMockData.initialEvent, id: null },
      });
      expect(queryByText('Drop event')).toBeNull();
    });

    test('dropping the event', async () => {
      const dropEvent = jest.fn();
      const onDrop = jest.fn();
      const { getByText } = renderEditEvent({ showDropButton: true, dropEvent, onDrop });
      await act(async () => {
        fireEvent.click(getByText('Drop event'));
        await waitFor(() => expect(getByText('OK')).toBeVisible());
        fireEvent.click(getByText('OK'));
        await waitFor(() => expect(getByText('OK')).not.toBeVisible());
      });
      expect(dropEvent).toHaveBeenCalled();
      expect(onDrop).toHaveBeenCalled();
    });

    test('canceling the drop', async () => {
      const dropEvent = jest.fn();
      const onDrop = jest.fn();
      const { getByText } = renderEditEvent({ showDropButton: true, dropEvent, onDrop });
      await act(async () => {
        fireEvent.click(getByText('Drop event'));
        await waitFor(() => expect(getByText('Cancel')).toBeVisible());
        fireEvent.click(getByText('Cancel'));
        await waitFor(() => expect(getByText('Cancel')).not.toBeVisible());
      });
      expect(dropEvent).not.toHaveBeenCalled();
      expect(onDrop).not.toHaveBeenCalled();
    });

    test('if the drop fails, it displays the error and does not call onDrop', async () => {
      const dropEvent = jest.fn(() => { throw new Error('fooey'); });
      const onDrop = jest.fn();
      const { getByText } = renderEditEvent({ showDropButton: true, dropEvent, onDrop });
      await act(async () => {
        fireEvent.click(getByText('Drop event'));
        await waitFor(() => expect(getByText('OK')).toBeVisible());
        fireEvent.click(getByText('OK'));
        await waitFor(() => expect(dropEvent).toHaveBeenCalled());
      });
      expect(getByText('fooey')).toBeVisible();
      expect(onDrop).not.toHaveBeenCalled();
    });
  });

  describe('cancel link', () => {
    test('no cancel link by default', () => {
      const { queryByText } = renderEditEvent();
      expect(queryByText((content, element) => element.tagName === 'A' && content === 'Cancel'))
        .toBeNull();
    });

    test('passing a cancelPath makes a cancel link show up', () => {
      const { queryAllByText } = renderEditEvent({ cancelPath: '/' });
      expect(queryAllByText((content, element) => element.tagName === 'A' && content === 'Cancel'))
        .toHaveLength(1);
    });
  });
});
