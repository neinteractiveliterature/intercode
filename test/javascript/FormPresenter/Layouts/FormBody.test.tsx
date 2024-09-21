import { render, fireEvent } from '../../testUtils';
import { convention, minimalForm } from '../../EventAdmin/formMockData';
import FormBody, { FormBodyProps } from '../../../../app/javascript/FormPresenter/Layouts/FormBody';
import { ItemInteractionTrackerContext } from '../../../../app/javascript/FormPresenter/ItemInteractionTracker';
import { getSortedParsedFormItems } from '../../../../app/javascript/Models/Form';
import { FormItemRole } from '../../../../app/javascript/graphqlTypes.generated';
import { vi } from 'vitest';

describe('FormBody', () => {
  const defaultProps: FormBodyProps = {
    currentUserViewerRole: FormItemRole.Normal,
    currentUserWriterRole: FormItemRole.Normal,
    formItems: getSortedParsedFormItems(minimalForm),
    formTypeIdentifier: minimalForm.form_type,
    convention,
    response: { __typename: 'Event', id: '123', form_response_attrs: { title: 'A title' } },
    responseValuesChanged: () => {},
    errors: {},
  };

  const renderFormBody = (overrideProps: Partial<FormBodyProps> = {}, interactedItemIds?: string[]) => {
    const interactedItemIdsSet = new Set<string>(interactedItemIds ?? []);
    return render(
      <ItemInteractionTrackerContext.Provider
        value={{
          hasInteractedWithItem: (id) => interactedItemIdsSet.has(id),
          interactWithItem: () => {},
          interactedItemIds: interactedItemIdsSet,
        }}
      >
        <FormBody {...defaultProps} {...overrideProps} />
      </ItemInteractionTrackerContext.Provider>,
    );
  };

  it('renders values correctly', async () => {
    const { getByLabelText } = await renderFormBody();

    expect((getByLabelText('Title*') as HTMLInputElement).value).toEqual('A title');
  });

  it('accepts item changes', async () => {
    const responseValuesChanged = vi.fn();
    const { getByLabelText } = await renderFormBody({ responseValuesChanged });

    fireEvent.change(getByLabelText('Title*'), { target: { value: 'Something' } });
    expect(responseValuesChanged).toHaveBeenCalledTimes(1);
    expect(responseValuesChanged).toHaveBeenCalledWith({ title: 'Something' });
  });

  describe('incomplete item errors', () => {
    it('does not show incomplete item errors on non-interacted items', async () => {
      const { getByLabelText } = await renderFormBody({
        response: { __typename: 'Event', id: '123', form_response_attrs: {} },
      });
      expect(getByLabelText('Title*')).not.toHaveClass('is-invalid');
    });

    it('shows errors on interacted items', async () => {
      const { getByLabelText } = await renderFormBody(
        { response: { __typename: 'Event', id: '123', form_response_attrs: {} } },
        ['title'],
      );
      expect(getByLabelText('Title*')).toHaveClass('is-invalid');
    });
  });

  describe('string item errors', () => {
    it('shows errors on items', async () => {
      const { getByText } = await renderFormBody({ errors: { title: ['blah'] } });
      expect(getByText('blah')).toBeVisible();
    });
  });
});
