import { useState } from 'react';
import { vi } from 'vitest';

import { render, userEvent, within } from '../../testUtils';
import EventEmailInput from '../../../../app/javascript/FormPresenter/ItemInputs/EventEmailInput';
import AgeRestrictionsInput from '../../../../app/javascript/FormPresenter/ItemInputs/AgeRestrictionsInput';
import TimeblockPreferenceItemInput from '../../../../app/javascript/FormPresenter/ItemInputs/TimeblockPreferenceItemInput';
import { AgeRestrictionsValue, EventEmailValue } from '../../../../app/javascript/FormAdmin/FormItemUtils';
import { UnparsedTimeblockPreference } from '../../../../app/javascript/FormPresenter/TimeblockTypes';
import { FormType, TimezoneMode } from '../../../../app/javascript/graphqlTypes.generated';
import { convention } from '../../EventAdmin/formMockData';
import { buildAgeRestrictionsItem, buildEventEmailItem, buildTimeblockPreferenceItem } from '../../fixtures/formItems';

describe('the more complex item inputs', () => {
  let user: ReturnType<typeof userEvent.setup>;
  const onInteract = vi.fn();
  const onChange = vi.fn();

  beforeEach(() => {
    user = userEvent.setup();
    onInteract.mockReset();
    onChange.mockReset();
  });

  const common = { formTypeIdentifier: FormType.Event, onInteract, valueInvalid: false };

  describe('EventEmailInput', () => {
    function Harness({
      initial,
      domain = 'events.example.com',
      valueInvalid = false,
      required = false,
    }: {
      initial?: EventEmailValue;
      domain?: string | null;
      valueInvalid?: boolean;
      required?: boolean;
    }) {
      const [value, setValue] = useState(initial);
      return (
        <EventEmailInput
          {...common}
          valueInvalid={valueInvalid}
          formItem={buildEventEmailItem({ required })}
          convention={{ ...convention, event_mailing_list_domain: domain }}
          value={value}
          onChange={(newValue) => {
            onChange(newValue);
            setValue(newValue ?? undefined);
          }}
        />
      );
    }

    it('offers the team mailing list only when the convention has a mailing list domain', async () => {
      const withDomain = await render(<Harness />);
      expect(withDomain.queryByRole('radio', { name: /mailing list/i })).toBeTruthy();
      withDomain.unmount();

      const withoutDomain = await render(<Harness domain={null} />);
      expect(withoutDomain.queryByRole('radio', { name: /mailing list/i })).toBeNull();
      expect(withoutDomain.getAllByRole('radio')).toHaveLength(2);
    });

    it('disables the email box until a behaviour is chosen', async () => {
      const { getByRole } = await render(<Harness />);

      expect(getByRole('textbox')).toBeDisabled();
    });

    it('starts on the saved con mail destination', async () => {
      const { getAllByRole } = await render(
        <Harness initial={{ con_mail_destination: 'gms', email: '' }} domain={null} />,
      );

      const checked = getAllByRole('radio').filter((radio) => (radio as HTMLInputElement).checked);
      expect(checked).toHaveLength(1);
    });

    it('starts on the team mailing list when a list name is saved and there is a domain', async () => {
      const { getByRole } = await render(
        <Harness initial={{ con_mail_destination: 'event_email', team_mailing_list_name: 'my-game' }} />,
      );

      expect(getByRole('radio', { name: /mailing list/i })).toBeChecked();
    });

    it('does not start on the team mailing list if the convention has no domain', async () => {
      const { getAllByRole } = await render(
        <Harness initial={{ con_mail_destination: 'event_email', team_mailing_list_name: 'my-game' }} domain={null} />,
      );

      expect(getAllByRole('radio').every((radio) => !(radio as HTMLInputElement).checked)).toBe(false);
    });

    it('sends an explicit null list name when switching to a contact email, so the server clears it', async () => {
      const { getAllByRole } = await render(<Harness domain={null} />);

      // (the first of the two is "use a contact email")
      await user.click(getAllByRole('radio')[0]);

      expect(onChange).toHaveBeenLastCalledWith({ con_mail_destination: 'event_email', team_mailing_list_name: null });
      expect(onInteract).toHaveBeenCalledWith('email');
    });

    it('reports the typed contact email', async () => {
      const { getAllByRole, getByRole } = await render(<Harness domain={null} />);
      await user.click(getAllByRole('radio')[0]);

      await user.type(getByRole('textbox'), 'a@b.co');

      expect(onChange).toHaveBeenLastCalledWith(
        expect.objectContaining({ email: 'a@b.co', team_mailing_list_name: null }),
      );
    });

    it('sends something truthy for the list name when switching to a team mailing list', async () => {
      const { getByRole } = await render(<Harness />);

      await user.click(getByRole('radio', { name: /mailing list/i }));

      expect(onChange).toHaveBeenLastCalledWith({ team_mailing_list_name: '', con_mail_destination: 'event_email' });
    });

    it('builds the list address from the alias and the convention’s domain', async () => {
      const { getByRole } = await render(<Harness />);
      await user.click(getByRole('radio', { name: /mailing list/i }));

      await user.type(getByRole('textbox'), 'game');

      expect(onChange).toHaveBeenLastCalledWith(
        expect.objectContaining({ team_mailing_list_name: 'game', email: 'game@events.example.com' }),
      );
    });

    it('sends no address for an empty alias', async () => {
      const { getByRole } = await render(<Harness initial={{ team_mailing_list_name: 'x' }} />);
      await user.clear(getByRole('textbox'));

      expect(onChange).toHaveBeenLastCalledWith({ team_mailing_list_name: '', email: undefined });
    });

    it('shows the required error when invalid, and a required marker', async () => {
      const { getByText, getAllByLabelText } = await render(<Harness valueInvalid required />);

      expect(getByText(/required/i)).toBeTruthy();
      expect(getAllByLabelText('Required').length).toBeGreaterThan(0);
    });
  });

  describe('AgeRestrictionsInput', () => {
    function Harness({ initial, valueInvalid = false }: { initial?: AgeRestrictionsValue; valueInvalid?: boolean }) {
      const [value, setValue] = useState(initial);
      return (
        <AgeRestrictionsInput
          {...common}
          valueInvalid={valueInvalid}
          formItem={buildAgeRestrictionsItem({ required: true })}
          value={value}
          onChange={(newValue) => {
            onChange(newValue);
            setValue(newValue ?? undefined);
          }}
        />
      );
    }

    it('shows the caption and the current minimum age', async () => {
      const { getByText, getByLabelText } = await render(<Harness initial={{ minimum_age: 18 }} />);

      expect(getByText('Age restrictions')).toBeTruthy();
      expect((getByLabelText(/minimum age/i) as HTMLInputElement).value).toBe('18');
    });

    it('is blank for no minimum age', async () => {
      const { getByLabelText } = await render(<Harness initial={{ minimum_age: null }} />);

      expect((getByLabelText(/minimum age/i) as HTMLInputElement).value).toBe('');
    });

    it('writes a default description when the minimum age is set with no description', async () => {
      const { getByLabelText } = await render(<Harness />);

      await user.type(getByLabelText(/minimum age/i), '1');

      expect(onChange).toHaveBeenLastCalledWith(
        expect.objectContaining({ minimum_age: 1, age_restrictions_description: expect.stringMatching(/\S/) }),
      );
      expect(onInteract).toHaveBeenCalledWith('age_restrictions');
    });

    it('keeps updating the default description as the minimum age changes', async () => {
      const { getByLabelText } = await render(<Harness />);

      await user.type(getByLabelText(/minimum age/i), '18');

      const descriptions = onChange.mock.calls.map(([value]) => value.age_restrictions_description);
      expect(descriptions[1]).toContain('18');
      expect(descriptions[1]).not.toBe(descriptions[0]);
    });

    it('leaves a description the user wrote alone when the minimum age changes', async () => {
      const { getByLabelText } = await render(
        <Harness initial={{ minimum_age: 16, age_restrictions_description: 'Bring a parent' }} />,
      );

      await user.type(getByLabelText(/minimum age/i), '1');

      expect(onChange).toHaveBeenLastCalledWith({ minimum_age: 161, age_restrictions_description: 'Bring a parent' });
    });

    it('clears the minimum age to null when the box is emptied', async () => {
      const { getByLabelText } = await render(
        <Harness initial={{ minimum_age: 18, age_restrictions_description: 'x' }} />,
      );

      await user.clear(getByLabelText(/minimum age/i));

      expect(onChange).toHaveBeenLastCalledWith({ minimum_age: null, age_restrictions_description: 'x' });
    });

    it('shows the required error when invalid', async () => {
      const { getByText } = await render(<Harness valueInvalid />);

      expect(getByText('This field is required.')).toBeTruthy();
    });
  });

  describe('TimeblockPreferenceItemInput', () => {
    const formItem = () =>
      buildTimeblockPreferenceItem({
        timeblocks: [
          { label: 'Morning', start: { hour: 9 }, finish: { hour: 12 } },
          { label: 'Afternoon', start: { hour: 13 }, finish: { hour: 17 } },
        ],
        omit_timeblocks: [{ label: 'Afternoon', date: '2017-01-02' }],
      });
    const timeblockConvention = {
      starts_at: '2017-01-01T00:00:00Z',
      ends_at: '2017-01-03T00:00:00Z',
      timezone_name: 'UTC',
      timezone_mode: TimezoneMode.ConventionLocal,
    };

    function Harness({
      initial,
      item = formItem(),
    }: {
      initial?: UnparsedTimeblockPreference[];
      item?: ReturnType<typeof formItem>;
    }) {
      const [value, setValue] = useState(initial);
      return (
        <TimeblockPreferenceItemInput
          {...common}
          formItem={item}
          convention={timeblockConvention}
          value={value}
          onChange={(newValue) => {
            onChange(newValue);
            setValue(newValue ?? undefined);
          }}
        />
      );
    }

    const preference = (ordinality: UnparsedTimeblockPreference['ordinality']): UnparsedTimeblockPreference => ({
      label: 'Morning',
      start: '2017-01-01T09:00:00.000+00:00',
      finish: '2017-01-01T12:00:00.000+00:00',
      ordinality,
    });

    it('shows the caption, a row per timeblock and a day column header', async () => {
      const { getByText, getAllByRole } = await render(<Harness />);

      expect(getByText('When can you play?')).toBeTruthy();
      expect(getByText('Morning')).toBeTruthy();
      expect(getByText('Afternoon')).toBeTruthy();
      expect(getAllByRole('columnheader').length).toBeGreaterThan(1);
    });

    it('shows each timeblock’s time range unless timestamps are hidden', async () => {
      const shown = await render(<Harness />);
      expect(shown.getByText('9:00am - 12:00pm')).toBeTruthy();
      shown.unmount();

      const hidden = await render(
        <Harness item={buildTimeblockPreferenceItem({ ...formItem().rendered_properties, hide_timestamps: true })} />,
      );
      expect(hidden.queryByText(/9:00am/)).toBeNull();
    });

    it('leaves out an omitted timeblock on its day', async () => {
      const { getAllByRole } = await render(<Harness />);

      const afternoonRow = getAllByRole('row').find((row) => within(row).queryByText('Afternoon'));
      // one selector for the day it is offered on, and an empty cell for the day it is omitted
      expect(within(afternoonRow as HTMLElement).getAllByRole('combobox')).toHaveLength(1);
    });

    it('defaults every cell to "Don’t care"', async () => {
      const { getAllByRole } = await render(<Harness />);

      for (const select of getAllByRole('combobox')) {
        expect((select as HTMLSelectElement).value).toBe('');
      }
    });

    it('records a first choice', async () => {
      const { getAllByRole } = await render(<Harness />);

      await user.selectOptions(getAllByRole('combobox')[0], '1');

      expect(onChange).toHaveBeenLastCalledWith([expect.objectContaining({ label: 'Morning', ordinality: '1' })]);
    });

    it('shows an existing preference, and changes its ordinality in place', async () => {
      const { getAllByRole } = await render(<Harness initial={[preference('1')]} />);
      const select = getAllByRole('combobox')[0] as HTMLSelectElement;
      expect(select.value).toBe('1');

      await user.selectOptions(select, 'X');

      expect(onChange).toHaveBeenLastCalledWith([expect.objectContaining({ label: 'Morning', ordinality: 'X' })]);
    });

    it('removes a preference when set back to "Don’t care"', async () => {
      const { getAllByRole } = await render(<Harness initial={[preference('2')]} />);

      await user.selectOptions(getAllByRole('combobox')[0], '');

      expect(onChange).toHaveBeenLastCalledWith([]);
    });

    it('keeps other preferences when changing one', async () => {
      const { getAllByRole } = await render(<Harness initial={[preference('2')]} />);

      await user.selectOptions(getAllByRole('combobox')[1], '3');

      const lastValue = onChange.mock.calls[onChange.mock.calls.length - 1][0] as UnparsedTimeblockPreference[];
      expect(lastValue.map((p) => p.ordinality).sort()).toEqual(['2', '3']);
    });
  });
});
