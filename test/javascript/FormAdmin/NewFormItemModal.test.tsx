import { vi } from 'vitest';

import { render, userEvent, waitFor, within } from '../testUtils';
import NewFormItemModal from '../../../app/javascript/FormAdmin/$id/edit/section/$sectionId/NewFormItemModal';
import {
  FormEditorContext,
  FormEditorContextValue,
  FormEditorForm,
} from '../../../app/javascript/FormAdmin/FormEditorContexts';
import { FormType, FormItemRole, TimezoneMode } from '../../../app/javascript/graphqlTypes.generated';
import { ParsedFormItem, TypedFormItem } from '../../../app/javascript/FormAdmin/FormItemUtils';
import FormTypes from '../../../config/form_types.json';

type NewItem = ParsedFormItem<Record<string, unknown>, unknown>;

const buildFormItem = (identifier: string): TypedFormItem => ({
  __typename: 'FormItem',
  id: identifier,
  position: 1,
  item_type: 'free_text',
  identifier,
  admin_description: null,
  public_description: null,
  expose_in: null,
  properties: { caption: identifier, lines: 1, free_text_type: 'text', format: 'text' },
  rendered_properties: { caption: identifier, lines: 1, free_text_type: 'text', format: 'text' },
  visibility: FormItemRole.Normal,
  writeability: FormItemRole.Normal,
  default_value: null,
});

const buildForm = (existingIdentifiers: string[]): FormEditorForm => ({
  __typename: 'Form',
  id: '1',
  title: 'Event form',
  form_type: FormType.Event,
  form_sections: [
    {
      __typename: 'FormSection',
      id: '1',
      position: 1,
      title: 'Main',
      form_items: existingIdentifiers.map(buildFormItem),
    },
  ],
});

const buildContext = (form: FormEditorForm): FormEditorContextValue => ({
  convention: {
    __typename: 'Convention',
    id: '1',
    name: 'Test Con',
    starts_at: null,
    ends_at: null,
    timezone_name: null,
    timezone_mode: TimezoneMode.UserLocal,
    event_mailing_list_domain: null,
    form,
  },
  form,
  formTypeIdentifier: FormType.Event,
  formType: FormTypes.event,
  formItemsById: new Map(),
});

describe('NewFormItemModal', () => {
  let user: ReturnType<typeof userEvent.setup>;
  const close = vi.fn();
  const createFormItem = vi.fn<(item: NewItem) => Promise<unknown>>();

  beforeEach(() => {
    user = userEvent.setup();
    close.mockReset();
    createFormItem.mockReset().mockResolvedValue(undefined);
  });

  const renderModal = (existingIdentifiers: string[] = []) =>
    render(
      <FormEditorContext.Provider value={buildContext(buildForm(existingIdentifiers))}>
        <NewFormItemModal visible close={close} createFormItem={createFormItem} formType={FormTypes.event} />
      </FormEditorContext.Provider>,
    );

  // (the test wrapper's confirm dialog has buttons of its own, so look within this modal's footer)
  const footerButton = (result: Awaited<ReturnType<typeof renderModal>>, name: string) =>
    within(result.getByRole('button', { name: 'Add', hidden: true }).closest('.modal-footer') as HTMLElement).getByRole(
      'button',
      { name, hidden: true },
    );

  const radio = (result: Awaited<ReturnType<typeof renderModal>>, name: string) =>
    result.getByRole('radio', { name, hidden: true });

  // Some item types are both a standard item and a custom item type (e.g. "Event email"); the standard items come
  // first on the page
  const standardRadio = (result: Awaited<ReturnType<typeof renderModal>>, name: string) =>
    result.getAllByRole('radio', { name, hidden: true })[0];

  it('offers the form type’s standard items and the custom item types (but not static text)', async () => {
    const result = await renderModal();

    expect(radio(result, 'Event title')).toBeTruthy();
    expect(radio(result, 'Event author(s)')).toBeTruthy();
    expect(radio(result, 'Free text')).toBeTruthy();
    expect(radio(result, 'Multiple choice')).toBeTruthy();
    expect(result.queryByRole('radio', { name: 'Static text', hidden: true })).toBeNull();
  });

  it('disables the standard items that the form already has', async () => {
    const result = await renderModal(['title']);

    expect(radio(result, 'Event title')).toBeDisabled();
    expect(radio(result, 'Event author(s)')).toBeEnabled();
  });

  it('does not let anything be added until an item has been chosen', async () => {
    const result = await renderModal();

    expect(footerButton(result, 'Add')).toBeDisabled();
  });

  describe('adding a standard item', () => {
    it('creates it with its identifier, type and caption, then closes', async () => {
      const result = await renderModal();

      await user.click(standardRadio(result, 'Event email'));
      await user.click(footerButton(result, 'Add'));

      await waitFor(() => expect(close).toHaveBeenCalledTimes(1));
      expect(createFormItem).toHaveBeenCalledTimes(1);
      expect(createFormItem.mock.calls[0][0]).toMatchObject({
        __typename: 'FormItem',
        item_type: 'event_email',
        identifier: 'event_email',
      });
    });

    it('asks which kind of item it should be when the standard item does not say, and needs that choice first', async () => {
      const result = await renderModal();

      await user.click(radio(result, 'Event title'));
      expect(footerButton(result, 'Add')).toBeDisabled();

      await user.selectOptions(result.getByRole('combobox', { name: 'Item type', hidden: true }), 'free_text');
      await user.click(footerButton(result, 'Add'));

      await waitFor(() => expect(close).toHaveBeenCalledTimes(1));
      expect(createFormItem.mock.calls[0][0]).toMatchObject({
        item_type: 'free_text',
        identifier: 'title',
        properties: expect.objectContaining({ caption: 'Event title' }),
      });
    });

    it('leaves the caption off item types that don’t have one', async () => {
      const result = await renderModal();

      await user.click(standardRadio(result, 'Event email'));
      await user.click(footerButton(result, 'Add'));

      await waitFor(() => expect(createFormItem).toHaveBeenCalled());
      expect(createFormItem.mock.calls[0][0].properties).not.toHaveProperty('caption');
    });
  });

  describe('adding a custom item', () => {
    it('asks for an identifier, which is needed before the item can be added', async () => {
      const result = await renderModal();

      await user.click(radio(result, 'Free text'));
      expect(footerButton(result, 'Add')).toBeDisabled();

      await user.type(result.getByLabelText('Identifier'), 'favorite_color');
      expect(footerButton(result, 'Add')).toBeEnabled();
    });

    it('creates an item of that type with its default properties and the identifier, then closes', async () => {
      const result = await renderModal();

      await user.click(radio(result, 'Free text'));
      await user.type(result.getByLabelText('Identifier'), 'favorite_color');
      await user.click(footerButton(result, 'Add'));

      await waitFor(() => expect(close).toHaveBeenCalledTimes(1));
      expect(createFormItem.mock.calls[0][0]).toMatchObject({
        __typename: 'FormItem',
        item_type: 'free_text',
        identifier: 'favorite_color',
      });
    });

    it('warns when the identifier is one a standard item already uses', async () => {
      const result = await renderModal();

      await user.click(radio(result, 'Free text'));
      await user.type(result.getByLabelText('Identifier'), 'title');

      expect(await result.findByText(/is a reserved identifier in event form forms/)).toBeTruthy();
    });
  });

  describe('when creating the item fails', () => {
    it('shows the error and stays open, so it can be retried', async () => {
      createFormItem.mockRejectedValue(new Error('Identifier has already been taken'));
      const result = await renderModal();

      await user.click(radio(result, 'Free text'));
      await user.type(result.getByLabelText('Identifier'), 'favorite_color');
      await user.click(footerButton(result, 'Add'));

      expect(await result.findByText(/Identifier has already been taken/)).toBeTruthy();
      expect(close).not.toHaveBeenCalled();
      expect(footerButton(result, 'Add')).toBeEnabled();
    });

    it('disables the buttons while the item is being created', async () => {
      let finish!: () => void;
      createFormItem.mockReturnValue(new Promise<void>((resolve) => (finish = resolve)));
      const result = await renderModal();

      await user.click(radio(result, 'Free text'));
      await user.type(result.getByLabelText('Identifier'), 'favorite_color');
      await user.click(footerButton(result, 'Add'));

      await waitFor(() => expect(footerButton(result, 'Add')).toBeDisabled());
      expect(footerButton(result, 'Cancel')).toBeDisabled();
      finish();
      await waitFor(() => expect(close).toHaveBeenCalled());
    });
  });

  it('closes without creating anything when cancelled', async () => {
    const result = await renderModal();

    await user.click(footerButton(result, 'Cancel'));

    expect(close).toHaveBeenCalledTimes(1);
    expect(createFormItem).not.toHaveBeenCalled();
  });
});
