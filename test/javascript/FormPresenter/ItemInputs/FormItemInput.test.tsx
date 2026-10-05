import { vi } from 'vitest';

import { render, userEvent } from '../../testUtils';
import FormItemInput from '../../../../app/javascript/FormPresenter/ItemInputs/FormItemInput';
import { TypedFormItem } from '../../../../app/javascript/FormAdmin/FormItemUtils';
import { FormType } from '../../../../app/javascript/graphqlTypes.generated';
import { convention } from '../../EventAdmin/formMockData';
import {
  buildAgeRestrictionsItem,
  buildDateItem,
  buildEventEmailItem,
  buildFreeTextItem,
  buildMultipleChoiceItem,
  buildRegistrationPolicyItem,
  buildStaticTextItem,
  buildTimeblockPreferenceItem,
  buildTimespanItem,
} from '../../fixtures/formItems';
import { buildBucket } from '../../fixtures/registrationPolicy';

describe('FormItemInput', () => {
  let user: ReturnType<typeof userEvent.setup>;
  const onChange = vi.fn();
  const onInteract = vi.fn();

  beforeEach(() => {
    user = userEvent.setup();
    onChange.mockReset();
    onInteract.mockReset();
  });

  const renderItem = (formItem: TypedFormItem, value?: unknown, valueInvalid = false) =>
    render(
      <FormItemInput
        formItem={formItem}
        formTypeIdentifier={FormType.Event}
        value={value}
        valueInvalid={valueInvalid}
        onChange={onChange}
        onInteract={onInteract}
        convention={{ ...convention, event_mailing_list_domain: null }}
      />,
    );

  describe('picks the input for the item type', () => {
    it('free_text', async () => {
      const { getByRole } = await renderItem(buildFreeTextItem());
      expect(getByRole('textbox')).toBeTruthy();
    });

    it('multiple_choice', async () => {
      const { getAllByRole } = await renderItem(buildMultipleChoiceItem());
      expect(getAllByRole('radio')).toHaveLength(3);
    });

    it('date', async () => {
      const { getByLabelText } = await renderItem(buildDateItem());
      expect((getByLabelText('Birthday', { selector: 'input' }) as HTMLInputElement).type).toBe('date');
    });

    it('timespan', async () => {
      const { getByLabelText } = await renderItem(buildTimespanItem());
      expect(getByLabelText('Unit of time')).toBeTruthy();
    });

    it('age_restrictions', async () => {
      const { getByLabelText } = await renderItem(buildAgeRestrictionsItem());
      expect(getByLabelText(/minimum age/i)).toBeTruthy();
    });

    it('event_email', async () => {
      const { getAllByRole } = await renderItem(buildEventEmailItem());
      expect(getAllByRole('radio')).toHaveLength(2);
    });

    it('timeblock_preference', async () => {
      const { getByText } = await renderItem(buildTimeblockPreferenceItem());
      expect(getByText('When can you play?')).toBeTruthy();
    });

    it('static_text', async () => {
      const { getByText } = await renderItem(buildStaticTextItem());
      expect(getByText('Some words')).toBeTruthy();
    });

    it('registration_policy', async () => {
      const { findByText } = await renderItem(buildRegistrationPolicyItem(), {
        buckets: [buildBucket({ name: 'Adventurer' })],
        prevent_no_preference_signups: false,
      });
      expect(await findByText(/Adventurer/)).toBeTruthy();
    });
  });

  it('reports a change along with the item’s identifier', async () => {
    const { getByRole } = await renderItem(buildFreeTextItem({ identifier: 'title' }));

    await user.type(getByRole('textbox'), 'A');

    expect(onChange).toHaveBeenCalledWith('title', 'A');
  });

  it('treats a value of the wrong type for the item as no value', async () => {
    const { getByRole } = await renderItem(buildFreeTextItem(), { not: 'a string' });

    expect((getByRole('textbox') as HTMLInputElement).value).toBe('');
  });

  it('turns a boolean answer to a multiple choice item into the matching choice', async () => {
    const item = buildMultipleChoiceItem({
      choices: [
        { caption: 'Yes', value: 'true' },
        { caption: 'No', value: 'false' },
      ],
    });

    const { getByRole } = await renderItem(item, false);

    expect(getByRole('radio', { name: 'No' })).toBeChecked();
  });

  it('shows items as invalid when told to', async () => {
    const { getByText } = await renderItem(buildFreeTextItem({ required: true }), '', true);

    expect(getByText('This field is required.')).toBeTruthy();
  });
});
