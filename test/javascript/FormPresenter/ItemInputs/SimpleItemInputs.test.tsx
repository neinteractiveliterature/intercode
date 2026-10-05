import { useState } from 'react';
import { vi } from 'vitest';

import { render, userEvent } from '../../testUtils';
import FreeTextItemInput from '../../../../app/javascript/FormPresenter/ItemInputs/FreeTextItemInput';
import DateItemInput from '../../../../app/javascript/FormPresenter/ItemInputs/DateItemInput';
import TimespanItemInput from '../../../../app/javascript/FormPresenter/ItemInputs/TimespanItemInput';
import { FormType } from '../../../../app/javascript/graphqlTypes.generated';
import { buildDateItem, buildFreeTextItem, buildTimespanItem } from '../../fixtures/formItems';

// (the caption labels carry an aria-label as well, so ask for the field itself)
const FIELD = { selector: 'input, textarea' };

describe('the simple item inputs', () => {
  let user: ReturnType<typeof userEvent.setup>;
  const onInteract = vi.fn();
  const onChange = vi.fn();

  beforeEach(() => {
    user = userEvent.setup();
    onInteract.mockReset();
    onChange.mockReset();
  });

  const common = { formTypeIdentifier: FormType.Event, onInteract, valueInvalid: false };

  describe('FreeTextItemInput', () => {
    function Harness({
      formItem,
      initial = '',
      valueInvalid = false,
    }: {
      formItem: ReturnType<typeof buildFreeTextItem>;
      initial?: string;
      valueInvalid?: boolean;
    }) {
      const [value, setValue] = useState(initial);
      return (
        <FreeTextItemInput
          {...common}
          valueInvalid={valueInvalid}
          formItem={formItem}
          value={value}
          onChange={(newValue) => {
            onChange(newValue);
            setValue(newValue ?? '');
          }}
        />
      );
    }

    it('is a single-line text input for one line', async () => {
      const { getByLabelText } = await render(<Harness formItem={buildFreeTextItem({ lines: 1 })} />);

      expect(getByLabelText('Description', FIELD).tagName).toBe('INPUT');
    });

    it('is a textarea of that many rows for several lines', async () => {
      const { getByLabelText } = await render(<Harness formItem={buildFreeTextItem({ lines: 4 })} />);

      const textarea = getByLabelText('Description', FIELD) as HTMLTextAreaElement;
      expect(textarea.tagName).toBe('TEXTAREA');
      expect(textarea.rows).toBe(4);
    });

    it('uses the configured input type', async () => {
      const { getByLabelText } = await render(<Harness formItem={buildFreeTextItem({ free_text_type: 'email' })} />);

      expect((getByLabelText('Description', FIELD) as HTMLInputElement).type).toBe('email');
    });

    it('defaults to a text input when there is no input type', async () => {
      const { getByLabelText } = await render(<Harness formItem={buildFreeTextItem({ free_text_type: null })} />);

      expect((getByLabelText('Description', FIELD) as HTMLInputElement).type).toBe('text');
    });

    it('shows the current value', async () => {
      const { getByLabelText } = await render(<Harness formItem={buildFreeTextItem()} initial="Hello" />);

      expect((getByLabelText('Description', FIELD) as HTMLInputElement).value).toBe('Hello');
    });

    it('reports changes and interaction', async () => {
      const { getByLabelText } = await render(<Harness formItem={buildFreeTextItem()} />);

      await user.type(getByLabelText('Description', FIELD), 'Hi');

      expect(onChange).toHaveBeenLastCalledWith('Hi');
      expect(onInteract).toHaveBeenCalledWith('description');
    });

    it('reports interaction when focus leaves, even if nothing was typed', async () => {
      const { getByLabelText } = await render(<Harness formItem={buildFreeTextItem({ lines: 3 })} />);

      await user.click(getByLabelText('Description', FIELD));
      await user.tab();

      expect(onInteract).toHaveBeenCalledWith('description');
      expect(onChange).not.toHaveBeenCalled();
    });

    it('marks an invalid value and says it is required', async () => {
      const { getByLabelText, getByText } = await render(
        <Harness formItem={buildFreeTextItem({ required: true })} valueInvalid />,
      );

      expect(getByLabelText(/Description/, FIELD).classList.contains('is-invalid')).toBe(true);
      expect(getByText('This field is required.')).toBeTruthy();
    });

    describe('advisory limits', () => {
      it('counts characters against the limit', async () => {
        const { getByText } = await render(
          <Harness formItem={buildFreeTextItem({ advisory_character_limit: 100 })} initial="Hello" />,
        );

        expect(getByText('5/100')).toBeTruthy();
      });

      it('counts words against the limit, ignoring extra whitespace', async () => {
        const { getByText } = await render(
          <Harness formItem={buildFreeTextItem({ advisory_word_limit: 50 })} initial="  one   two three " />,
        );

        expect(getByText('3/50')).toBeTruthy();
      });

      it('labels both counts when there are both limits', async () => {
        const { getByText } = await render(
          <Harness
            formItem={buildFreeTextItem({ advisory_character_limit: 100, advisory_word_limit: 20 })}
            initial="one two"
          />,
        );

        expect(getByText('7/100 characters')).toBeTruthy();
        expect(getByText('2/20 words')).toBeTruthy();
      });

      it('goes from green to yellow to red as the limit nears and passes', async () => {
        const countClass = async (text: string) => {
          const { getByText, unmount } = await render(
            <Harness formItem={buildFreeTextItem({ advisory_character_limit: 100 })} initial={text} />,
          );
          const className = getByText(`${text.length}/100`).className;
          unmount();
          return className;
        };

        expect(await countClass('a'.repeat(50))).toBe('text-success');
        expect(await countClass('a'.repeat(95))).toBe('text-warning');
        expect(await countClass('a'.repeat(100))).toBe('text-warning');
        expect(await countClass('a'.repeat(101))).toBe('text-danger');
      });

      it('shows nothing without limits', async () => {
        const { container } = await render(<Harness formItem={buildFreeTextItem()} initial="Hello" />);

        expect(container.textContent).not.toMatch(/\d+\/\d+/);
      });
    });
  });

  describe('DateItemInput', () => {
    const renderDate = (value?: string, valueInvalid = false) =>
      render(
        <DateItemInput
          {...common}
          valueInvalid={valueInvalid}
          formItem={buildDateItem()}
          value={value}
          onChange={onChange}
        />,
      );

    it('shows the current date', async () => {
      const { getByLabelText } = await renderDate('2026-06-05');

      expect((getByLabelText('Birthday', FIELD) as HTMLInputElement).value).toBe('2026-06-05');
    });

    it('is blank without a value', async () => {
      const { getByLabelText } = await renderDate(undefined);

      expect((getByLabelText('Birthday', FIELD) as HTMLInputElement).value).toBe('');
    });

    it('reports a chosen date and interaction', async () => {
      const { getByLabelText } = await renderDate();

      await user.type(getByLabelText('Birthday', FIELD), '2026-07-04');

      expect(onChange).toHaveBeenLastCalledWith('2026-07-04');
      expect(onInteract).toHaveBeenCalledWith('birthday');
    });

    it('marks an invalid value', async () => {
      const { getByLabelText, getByText } = await renderDate(undefined, true);

      expect(getByLabelText('Birthday', FIELD).classList.contains('is-invalid')).toBe(true);
      expect(getByText('This field is required.')).toBeTruthy();
    });
  });

  describe('TimespanItemInput', () => {
    function Harness({ initial }: { initial?: number | null }) {
      const [value, setValue] = useState(initial);
      return (
        <TimespanItemInput
          {...common}
          formItem={buildTimespanItem()}
          value={value}
          onChange={(newValue) => {
            onChange(newValue);
            setValue(newValue);
          }}
        />
      );
    }

    it('is blank without a value', async () => {
      const { getByLabelText } = await render(<Harness />);

      expect((getByLabelText('Length', FIELD) as HTMLInputElement).value).toBe('');
    });

    it('shows a value in the largest unit that divides it evenly', async () => {
      const { getByLabelText } = await render(<Harness initial={2 * 60 * 60} />);

      expect((getByLabelText('Length', FIELD) as HTMLInputElement).value).toBe('2');
      expect((getByLabelText('Unit of time') as HTMLSelectElement).value).toBe('hour');
    });

    it('reports the typed quantity in seconds, in the selected unit', async () => {
      const { getByLabelText } = await render(<Harness />);

      await user.selectOptions(getByLabelText('Unit of time'), 'minute');
      await user.type(getByLabelText('Length', FIELD), '90');

      expect(onChange).toHaveBeenLastCalledWith(90 * 60);
      expect(onInteract).toHaveBeenCalledWith('length');
    });

    it('reports null when the box is cleared', async () => {
      const { getByLabelText } = await render(<Harness initial={3600} />);

      await user.clear(getByLabelText('Length', FIELD));

      expect(onChange).toHaveBeenLastCalledWith(null);
    });

    it('re-expresses the same duration when the unit changes', async () => {
      const { getByLabelText } = await render(<Harness initial={7200} />);

      await user.selectOptions(getByLabelText('Unit of time'), 'minute');

      expect((getByLabelText('Length', FIELD) as HTMLInputElement).value).toBe('120');
    });
  });
});
