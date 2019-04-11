import React from 'react';
import { render, act, fireEvent } from 'react-testing-library';
import { renderHook } from 'react-hooks-testing-library';

import { convention, initialEvent, minimalForm } from './formMockData';
import useEventForm, { EventForm } from '../../../app/javascript/EventAdmin/useEventForm';

describe('useEventForm', () => {
  const renderEventFormHook = (overrides = {}) => renderHook(() => useEventForm({
    convention, initialEvent, eventForm: minimalForm, ...overrides,
  }));

  const renderEventForm = (result, overrideProps = {}) => {
    const renderResult = render(
      <EventForm {...result.current[0]} {...overrideProps} />,
    );

    return {
      ...renderResult,
      rerender: (props = {}) => renderResult.rerender(
        <EventForm {...result.current[0]} {...props} />,
      ),
    };
  };

  it('returns props for an EventForm', () => {
    const { result } = renderEventFormHook();
    const { getAllByLabelText } = renderEventForm(result);
    expect(getAllByLabelText('Title*')).toHaveLength(1);
  });

  it('changes the event when response values are changed', () => {
    const { result } = renderEventFormHook();
    const [eventFormProps] = result.current;
    act(() => eventFormProps.formResponseValuesChanged({ title: 'An event' }));
    const [, { event }] = result.current;
    expect(event.form_response_attrs.title).toEqual('An event');
  });

  describe('event', () => {
    it('defaults to a minimal event', () => {
      const { result } = renderEventFormHook({ initialEvent: null });
      const [, { event }] = result.current;
      expect(event.id).toBeUndefined();
      expect(event.form_response_attrs).not.toBeUndefined();
    });

    it('takes the given event if provided', () => {
      const { result } = renderEventFormHook();
      const [, { event }] = result.current;
      expect(event).toBe(initialEvent);
    });
  });

  describe('setEvent', () => {
    it('sets the event', () => {
      const { result } = renderEventFormHook();
      const [, { setEvent }] = result.current;
      const fakeEvent = { something: 'blah' };

      act(() => setEvent(fakeEvent));

      const [, { event }] = result.current;
      expect(event).toBe(fakeEvent);
    });
  });

  describe('validateForm', () => {
    it('validates all required fields', () => {
      const { result } = renderEventFormHook();
      const { getByLabelText, rerender } = renderEventForm(result);
      fireEvent.change(getByLabelText('Title*'), { target: { value: 'An event' } });
      const [, { validateForm }] = result.current;
      expect(validateForm()).toBe(true);
      rerender();
      expect(getByLabelText('Title*')).not.toHaveClass('is-invalid');
    });

    it('errors if a required field is not present', () => {
      const { result } = renderEventFormHook({});
      const { getByLabelText, rerender } = renderEventForm(result);
      const [, { validateForm }] = result.current;
      let validationResult;
      act(() => { validationResult = validateForm(); });
      expect(validationResult).toBe(false);
      rerender();
      expect(getByLabelText('Title*')).toHaveClass('is-invalid');
    });
  });
});
