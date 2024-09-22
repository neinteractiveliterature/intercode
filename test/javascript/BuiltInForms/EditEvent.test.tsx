import * as formMockData from '../EventAdmin/formMockData';
import EditEvent from '../../../app/javascript/BuiltInForms/EditEvent';
import useEventForm, { EventForm } from '../../../app/javascript/EventAdmin/useEventForm';
import { render, fireEvent, waitFor } from '../testUtils';
import { vi } from 'vitest';

const defaultProps = {
  updateEvent: async () => {},
  onSave: () => {},
};

function EditEventTester({
  convention,
  initialEvent,
  eventForm,
  ...props
}: Partial<typeof formMockData> & { eventForm?: typeof formMockData.minimalForm }) {
  const [formProps, { event, validateForm }] = useEventForm({
    convention: convention || formMockData.convention,
    initialEvent: initialEvent || formMockData.initialEvent,
    eventForm: eventForm || formMockData.minimalForm,
  });
  return (
    <EditEvent event={event} validateForm={validateForm} {...defaultProps} {...props}>
      <EventForm {...formProps} />
    </EditEvent>
  );
}

describe('EditEvent', () => {
  const renderEditEvent = (overrideProps = {}) => render(<EditEventTester {...overrideProps} />);

  describe('header text', () => {
    test('edit event', async () => {
      const { getByText } = await renderEditEvent();
      expect(getByText('Edit event').tagName).toEqual('H3');
    });

    test('new event', async () => {
      const { getByText } = await renderEditEvent({
        initialEvent: { ...formMockData.initialEvent, id: null },
      });
      expect(getByText('New event').tagName).toEqual('H3');
    });
  });

  describe('saving', () => {
    test('the save button validates the form', async () => {
      const updateEvent = vi.fn();
      const onSave = vi.fn();
      const { getByText, getByLabelText } = await renderEditEvent({ updateEvent, onSave });
      fireEvent.click(getByText('Save event'));
      await waitFor(() => expect(getByLabelText('Title*')).toHaveClass('is-invalid'));
      expect(updateEvent).not.toHaveBeenCalled();
      expect(onSave).not.toHaveBeenCalled();
    });

    test('the save button updates the event and calls onSave', async () => {
      const updateEvent = vi.fn();
      const onSave = vi.fn();
      const { getByText } = await renderEditEvent({
        updateEvent,
        onSave,
        initialEvent: {
          ...formMockData.initialEvent,
          form_response_attrs: { title: 'An event' },
        },
      });
      fireEvent.click(getByText('Save event'));
      await waitFor(() => expect(onSave).toHaveBeenCalled());
      expect(updateEvent).toHaveBeenCalled();
    });

    test('if the save fails, it displays the error and does not call onSave', async () => {
      const updateEvent = vi.fn(() => {
        throw new Error('blahhhh');
      });
      const onSave = vi.fn();
      const { getByText } = await renderEditEvent({
        updateEvent,
        onSave,
        initialEvent: {
          ...formMockData.initialEvent,
          form_response_attrs: { title: 'An event' },
        },
      });
      fireEvent.click(getByText('Save event'));
      await waitFor(() => expect(getByText('blahhhh')).toBeVisible());
      expect(updateEvent).toHaveBeenCalled();
      expect(onSave).not.toHaveBeenCalled();
    });
  });

  describe('drop event workflow', () => {
    test('no drop button by default', async () => {
      const { queryByText } = await renderEditEvent();
      expect(queryByText('Drop event')).toBeNull();
    });

    test('showDropButton gets it to render a drop button', async () => {
      const { queryAllByText } = await renderEditEvent({ showDropButton: true });
      expect(queryAllByText('Drop event')).toHaveLength(1);
    });

    test('if the event is already dropped, the drop button does not show up', async () => {
      const { queryByText } = await renderEditEvent({
        showDropButton: true,
        initialEvent: { ...formMockData.initialEvent, status: 'dropped' },
      });
      expect(queryByText('Drop event')).toBeNull();
    });

    test('if the event is not yet saved, the drop button does not show up', async () => {
      const { queryByText } = await renderEditEvent({
        showDropButton: true,
        initialEvent: { ...formMockData.initialEvent, id: null },
      });
      expect(queryByText('Drop event')).toBeNull();
    });

    test('dropping the event', async () => {
      const dropEvent = vi.fn();
      const onDrop = vi.fn();
      const { getByText } = await renderEditEvent({ showDropButton: true, dropEvent, onDrop });
      fireEvent.click(getByText('Drop event'));
      await waitFor(() => expect(getByText('OK')).toBeVisible());
      fireEvent.click(getByText('OK'));
      await waitFor(() => expect(getByText('OK')).not.toBeVisible());
      expect(dropEvent).toHaveBeenCalled();
      expect(onDrop).toHaveBeenCalled();
    });

    test('canceling the drop', async () => {
      const dropEvent = vi.fn();
      const onDrop = vi.fn();
      const { getByText } = await renderEditEvent({ showDropButton: true, dropEvent, onDrop });
      fireEvent.click(getByText('Drop event'));
      await waitFor(() => expect(getByText('Cancel')).toBeVisible());
      fireEvent.click(getByText('Cancel'));
      await waitFor(() => expect(getByText('Cancel')).not.toBeVisible());
      expect(dropEvent).not.toHaveBeenCalled();
      expect(onDrop).not.toHaveBeenCalled();
    });

    test('if the drop fails, it displays the error and does not call onDrop', async () => {
      const dropEvent = vi.fn().mockRejectedValue(new Error('fooey'));
      const onDrop = vi.fn();
      const { getByText } = await renderEditEvent({ showDropButton: true, dropEvent, onDrop });
      fireEvent.click(getByText('Drop event'));
      await waitFor(() => expect(getByText('OK')).toBeInTheDocument());
      fireEvent.click(getByText('OK'));
      await waitFor(() => expect(getByText('fooey')).toBeInTheDocument());
      expect(dropEvent).toHaveBeenCalled();
      expect(onDrop).not.toHaveBeenCalled();
    });
  });

  describe('cancel link', () => {
    test('no cancel link by default', async () => {
      const { queryByText } = await renderEditEvent();
      expect(queryByText((content, element) => element?.tagName === 'A' && content === 'Cancel')).toBeNull();
    });

    test('passing a cancelPath makes a cancel link show up', async () => {
      const { queryAllByText } = await renderEditEvent({ cancelPath: '/' });
      expect(queryAllByText((content, element) => element?.tagName === 'A' && content === 'Cancel')).toHaveLength(1);
    });
  });
});
