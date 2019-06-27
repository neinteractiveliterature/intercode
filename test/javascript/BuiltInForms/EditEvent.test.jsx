import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { BrowserRouter } from 'react-router-dom';

import { convention, initialEvent, minimalForm } from '../EventAdmin/formMockData';
import EditEvent from '../../../app/javascript/BuiltInForms/EditEvent';
import useEventForm, { EventForm } from '../../../app/javascript/EventAdmin/useEventForm';
import {
  render, act, fireEvent, wait,
} from '../testUtils';

describe('EditEvent', () => {
  const defaultProps = {
    updateEvent: () => {},
    onSave: () => {},
  };

  const renderEventFormHook = (overrides = {}) => renderHook(() => useEventForm({
    convention, initialEvent, eventForm: minimalForm, ...overrides,
  }));

  const renderEditEvent = (result, overrideProps = {}) => {
    const getNodeToRender = (props) => {
      const [formProps, { event, validateForm }] = result.current;
      return (
        <BrowserRouter basename="/">
          <EditEvent event={event} validateForm={validateForm} {...defaultProps} {...props}>
            <EventForm {...formProps} />
          </EditEvent>
        </BrowserRouter>
      );
    };

    const renderResult = render(getNodeToRender(overrideProps));

    return {
      ...renderResult,
      rerender: (props = {}) => renderResult.rerender(getNodeToRender(props)),
    };
  };

  describe('header text', () => {
    test('edit event', () => {
      const { result } = renderEventFormHook();
      const { getByText } = renderEditEvent(result);
      expect(getByText('Edit event').tagName).toEqual('H3');
    });

    test('new event', () => {
      const { result } = renderEventFormHook({ initialEvent: { ...initialEvent, id: null } });
      const { getByText } = renderEditEvent(result);
      expect(getByText('New event').tagName).toEqual('H3');
    });
  });

  describe('saving', () => {
    test('the save button validates the form', async () => {
      const updateEvent = jest.fn();
      const onSave = jest.fn();
      const { result } = renderEventFormHook();
      const { getByText, getByLabelText, rerender } = renderEditEvent(
        result,
        { updateEvent, onSave },
      );
      act(() => {
        fireEvent.click(getByText('Save event'));
      });
      rerender({ updateEvent, onSave });
      expect(getByLabelText('Title*')).toHaveClass('is-invalid');
      expect(updateEvent).not.toHaveBeenCalled();
      expect(onSave).not.toHaveBeenCalled();
    });

    test('the save button updates the event and calls onSave', async () => {
      const updateEvent = jest.fn();
      const onSave = jest.fn();
      const { result } = renderEventFormHook({
        initialEvent: {
          ...initialEvent,
          form_response_attrs: { title: 'An event' },
        },
      });
      const { getByText, rerender } = renderEditEvent(
        result,
        { updateEvent, onSave },
      );
      fireEvent.click(getByText('Save event'));
      rerender({ updateEvent, onSave });
      await wait(() => expect(updateEvent).toHaveBeenCalled());
      await wait(() => expect(onSave).toHaveBeenCalled());
    });

    test('if the save fails, it displays the error and does not call onSave', async () => {
      const updateEvent = jest.fn(() => { throw new Error('blahhhh'); });
      const onSave = jest.fn();
      const { result } = renderEventFormHook({
        initialEvent: {
          ...initialEvent,
          form_response_attrs: { title: 'An event' },
        },
      });
      const { getByText, rerender } = renderEditEvent(
        result,
        { updateEvent, onSave },
      );
      fireEvent.click(getByText('Save event'));
      rerender({ updateEvent, onSave });
      await wait(() => expect(updateEvent).toHaveBeenCalled());
      expect(getByText('blahhhh')).toBeVisible();
      expect(onSave).not.toHaveBeenCalled();
    });
  });

  describe('drop event workflow', () => {
    test('no drop button by default', () => {
      const { result } = renderEventFormHook();
      const { queryByText } = renderEditEvent(result);
      expect(queryByText('Drop event')).toBeNull();
    });

    test('showDropButton gets it to render a drop button', () => {
      const { result } = renderEventFormHook();
      const { queryAllByText } = renderEditEvent(result, { showDropButton: true });
      expect(queryAllByText('Drop event')).toHaveLength(1);
    });

    test('if the event is already dropped, the drop button does not show up', () => {
      const { result } = renderEventFormHook({ initialEvent: { ...initialEvent, status: 'dropped' } });
      const { queryByText } = renderEditEvent(result, { showDropButton: true });
      expect(queryByText('Drop event')).toBeNull();
    });

    test('if the event is not yet saved, the drop button does not show up', () => {
      const { result } = renderEventFormHook({ initialEvent: { ...initialEvent, id: null } });
      const { queryByText } = renderEditEvent(result, { showDropButton: true });
      expect(queryByText('Drop event')).toBeNull();
    });

    test('dropping the event', async () => {
      const dropEvent = jest.fn();
      const onDrop = jest.fn();
      const { result } = renderEventFormHook();
      const { getByText } = renderEditEvent(result, { showDropButton: true, dropEvent, onDrop });
      act(() => { fireEvent.click(getByText('Drop event')); });
      await wait(() => expect(getByText('OK')).toBeVisible());
      act(() => { fireEvent.click(getByText('OK')); });
      await wait(() => expect(dropEvent).toHaveBeenCalled());
      await wait(() => expect(onDrop).toHaveBeenCalled());
    });

    test('canceling the drop', async () => {
      const dropEvent = jest.fn();
      const onDrop = jest.fn();
      const { result } = renderEventFormHook();
      const { getByText } = renderEditEvent(result, { showDropButton: true, dropEvent, onDrop });
      fireEvent.click(getByText('Drop event'));
      await wait(() => expect(getByText('Cancel')).toBeVisible());
      fireEvent.click(getByText('Cancel'));
      expect(dropEvent).not.toHaveBeenCalled();
      expect(onDrop).not.toHaveBeenCalled();
    });

    test('if the drop fails, it displays the error and does not call onDrop', async () => {
      const dropEvent = jest.fn(() => { throw new Error('fooey'); });
      const onDrop = jest.fn();
      const { result } = renderEventFormHook();
      const { getByText } = renderEditEvent(result, { showDropButton: true, dropEvent, onDrop });
      act(() => { fireEvent.click(getByText('Drop event')); });
      await wait(() => expect(getByText('OK')).toBeVisible());
      act(() => { fireEvent.click(getByText('OK')); });
      await wait(() => expect(dropEvent).toHaveBeenCalled());
      expect(getByText('fooey')).toBeVisible();
      expect(onDrop).not.toHaveBeenCalled();
    });
  });

  describe('cancel link', () => {
    test('no cancel link by default', () => {
      const { result } = renderEventFormHook();
      const { queryByText } = renderEditEvent(result);
      expect(queryByText((content, element) => element.tagName === 'A' && content === 'Cancel'))
        .toBeNull();
    });

    test('passing a cancelPath makes a cancel link show up', () => {
      const { result } = renderEventFormHook();
      const { queryAllByText } = renderEditEvent(result, { cancelPath: '/' });
      expect(queryAllByText((content, element) => element.tagName === 'A' && content === 'Cancel'))
        .toHaveLength(1);
    });
  });
});
