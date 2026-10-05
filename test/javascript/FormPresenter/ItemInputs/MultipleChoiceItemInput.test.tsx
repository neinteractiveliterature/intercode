import { useState } from 'react';
import { vi } from 'vitest';

import { render, userEvent } from '../../testUtils';
import MultipleChoiceItemInput from '../../../../app/javascript/FormPresenter/ItemInputs/MultipleChoiceItemInput';
import { FormItemValueType, MultipleChoiceFormItem } from '../../../../app/javascript/FormAdmin/FormItemUtils';
import { FormItemRole, FormType } from '../../../../app/javascript/graphqlTypes.generated';
import { buildMultipleChoiceItem } from '../../fixtures/formItems';

type Value = FormItemValueType<MultipleChoiceFormItem> | null | undefined;

describe('MultipleChoiceItemInput', () => {
  let user: ReturnType<typeof userEvent.setup>;
  const onInteract = vi.fn();
  const onChange = vi.fn<(value: Value) => void>();

  beforeEach(() => {
    user = userEvent.setup();
    onInteract.mockReset();
    onChange.mockReset();
  });

  // Keeps the value in state like the form presenter does, so that a sequence of clicks builds on itself
  const renderInput = (
    formItem: MultipleChoiceFormItem,
    initialValue: Value = undefined,
    { valueInvalid = false }: { valueInvalid?: boolean } = {},
  ) => {
    function Harness() {
      const [value, setValue] = useState<Value>(initialValue);
      return (
        <MultipleChoiceItemInput
          formItem={formItem}
          formTypeIdentifier={FormType.Event}
          value={value}
          valueInvalid={valueInvalid}
          onInteract={onInteract}
          onChange={(newValue) => {
            onChange(newValue);
            setValue(newValue);
          }}
        />
      );
    }

    return render(<Harness />);
  };

  const lastChange = () => onChange.mock.calls[onChange.mock.calls.length - 1][0];

  describe('a radio question', () => {
    it('shows the caption and a radio per choice', async () => {
      const { getByText, getByRole } = await renderInput(buildMultipleChoiceItem());

      expect(getByText('Favorite color')).toBeTruthy();
      for (const name of ['Red', 'Green', 'Blue']) {
        expect(getByRole('radio', { name })).toBeTruthy();
      }
    });

    it('checks the current value', async () => {
      const { getByRole } = await renderInput(buildMultipleChoiceItem(), 'green');

      expect(getByRole('radio', { name: 'Green' })).toBeChecked();
      expect(getByRole('radio', { name: 'Red' })).not.toBeChecked();
    });

    it('reports a chosen value and that the user interacted', async () => {
      const { getByRole } = await renderInput(buildMultipleChoiceItem());

      await user.click(getByRole('radio', { name: 'Blue' }));

      expect(lastChange()).toBe('blue');
      expect(onInteract).toHaveBeenCalledWith('favorite_color');
    });

    it('treats a boolean value as its string', async () => {
      const item = buildMultipleChoiceItem({
        choices: [
          { caption: 'Yes', value: 'true' },
          { caption: 'No', value: 'false' },
        ],
      });

      const { getByRole } = await renderInput(item, true);

      expect(getByRole('radio', { name: 'Yes' })).toBeChecked();
    });

    it('uses the first of an array value', async () => {
      const { getByRole } = await renderInput(buildMultipleChoiceItem(), ['red', 'blue']);

      expect(getByRole('radio', { name: 'Red' })).toBeChecked();
    });

    describe('with an Other choice', () => {
      const item = () => buildMultipleChoiceItem({ other: true, other_caption: 'Something else' });

      it('offers it, with its caption', async () => {
        const { getByRole } = await renderInput(item());

        expect(getByRole('radio', { name: 'Something else' })).toBeTruthy();
      });

      it('falls back to "Other" as the caption', async () => {
        const { getByRole } = await renderInput(buildMultipleChoiceItem({ other: true }));

        expect(getByRole('radio', { name: 'Other' })).toBeTruthy();
      });

      it('shows a text box once Other is chosen, and reports what is typed there', async () => {
        const { getByRole, queryByRole, getByLabelText } = await renderInput(item());
        expect(queryByRole('textbox')).toBeNull();

        await user.click(getByRole('radio', { name: 'Something else' }));
        await user.type(getByLabelText('Something else: please specify'), 'Teal');

        expect(lastChange()).toBe('Teal');
        expect(getByRole('radio', { name: 'Something else' })).toBeChecked();
      });

      it('shows a value that is not one of the choices as Other, with that value in the box', async () => {
        const { getByRole, getByLabelText } = await renderInput(item(), 'Magenta');

        expect(getByRole('radio', { name: 'Something else' })).toBeChecked();
        expect((getByLabelText('Something else: please specify') as HTMLInputElement).value).toBe('Magenta');
      });

      it('clears the Other text when a provided choice is picked instead', async () => {
        const { getByRole, queryByRole } = await renderInput(item(), 'Magenta');

        await user.click(getByRole('radio', { name: 'Red' }));

        expect(lastChange()).toBe('red');
        expect(queryByRole('textbox')).toBeNull();
      });

      it('has no Other when the item does not allow it', async () => {
        const { queryByRole } = await renderInput(buildMultipleChoiceItem(), 'Magenta');

        expect(queryByRole('textbox')).toBeNull();
      });
    });
  });

  describe('a checkbox question', () => {
    const checkboxItem = (overrides: Partial<MultipleChoiceFormItem['rendered_properties']> = {}) =>
      buildMultipleChoiceItem({ style: 'checkbox_vertical', ...overrides });

    it('shows a checkbox per choice, checking the current values', async () => {
      const { getByRole } = await renderInput(checkboxItem(), ['red', 'blue']);

      expect(getByRole('checkbox', { name: 'Red' })).toBeChecked();
      expect(getByRole('checkbox', { name: 'Green' })).not.toBeChecked();
      expect(getByRole('checkbox', { name: 'Blue' })).toBeChecked();
    });

    it('adds a value when a box is checked', async () => {
      const { getByRole } = await renderInput(checkboxItem(), ['red']);

      await user.click(getByRole('checkbox', { name: 'Green' }));

      expect(lastChange()).toEqual(['red', 'green']);
      expect(onInteract).toHaveBeenCalledWith('favorite_color');
    });

    it('removes a value when a box is unchecked', async () => {
      const { getByRole } = await renderInput(checkboxItem(), ['red', 'green']);

      await user.click(getByRole('checkbox', { name: 'Red' }));

      expect(lastChange()).toEqual(['green']);
    });

    it('starts from nothing checked when there is no value', async () => {
      const { getByRole } = await renderInput(checkboxItem());

      await user.click(getByRole('checkbox', { name: 'Blue' }));

      expect(lastChange()).toEqual(['blue']);
    });

    it('treats a single string value as one checked value', async () => {
      const { getByRole } = await renderInput(checkboxItem(), 'green');

      expect(getByRole('checkbox', { name: 'Green' })).toBeChecked();
    });

    it('lays horizontal checkboxes out inline', async () => {
      const { getByRole } = await renderInput(checkboxItem({ style: 'checkbox_horizontal' }));

      expect(
        getByRole('checkbox', { name: 'Red' }).closest('.form-check')?.classList.contains('form-check-inline'),
      ).toBe(true);
    });

    describe('with an Other choice', () => {
      const item = () => checkboxItem({ other: true });

      it('can be ticked, and then takes typed text alongside the other values', async () => {
        const { getByRole, getByLabelText } = await renderInput(item(), ['red']);

        await user.click(getByRole('checkbox', { name: 'Other' }));
        expect(getByRole('checkbox', { name: 'Other' })).toBeChecked();
        await user.type(getByLabelText('Other: please specify'), 'Teal');

        expect(lastChange()).toEqual(['red', 'Teal']);
      });

      it('shows a value that is not one of the choices as Other, with that value in the box', async () => {
        const { getByRole, getByLabelText } = await renderInput(item(), ['red', 'Magenta']);

        expect(getByRole('checkbox', { name: 'Other' })).toBeChecked();
        expect((getByLabelText('Other: please specify') as HTMLInputElement).value).toBe('Magenta');
      });

      it('drops the Other value when the Other box is unchecked', async () => {
        const { getByRole } = await renderInput(item(), ['red', 'Magenta']);

        await user.click(getByRole('checkbox', { name: 'Other' }));

        expect(lastChange()).toEqual(['red']);
      });
    });
  });

  describe('validation and visibility', () => {
    it('shows the required message and a red border when the value is invalid', async () => {
      const { getByText } = await renderInput(buildMultipleChoiceItem({ required: true }), undefined, {
        valueInvalid: true,
      });

      expect(getByText('This field is required.')).toBeTruthy();
      expect(getByText('This field is required.').parentElement?.classList.contains('border-danger')).toBe(true);
    });

    it('marks required questions', async () => {
      const { getByLabelText } = await renderInput(buildMultipleChoiceItem({ required: true }));

      expect(getByLabelText('Required')).toBeTruthy();
    });

    it('does not show the required message when valid', async () => {
      const { queryByText } = await renderInput(buildMultipleChoiceItem());

      expect(queryByText('This field is required.')).toBeNull();
    });

    it('discloses who can see an item that is not publicly visible', async () => {
      const { getByText } = await renderInput(buildMultipleChoiceItem({ visibility: FormItemRole.TeamMember }));

      expect(getByText(/visible/i)).toBeTruthy();
    });
  });
});
