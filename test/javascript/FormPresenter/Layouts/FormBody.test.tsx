import React from 'react';

import { render, fireEvent } from '../../testUtils';
import { convention, minimalForm } from '../../EventAdmin/formMockData';
import FormBody, { FormBodyProps } from '../../../../app/javascript/FormPresenter/Layouts/FormBody';
import { ItemInteractionTrackerContext } from '../../../../app/javascript/FormPresenter/ItemInteractionTracker';
import { getSortedParsedFormItems } from '../../../../app/javascript/Models/Form';

describe('FormBody', () => {
  const defaultProps: FormBodyProps = {
    formItems: getSortedParsedFormItems(minimalForm),
    convention,
    response: { form_response_attrs: { title: 'A title' } },
    responseValuesChanged: () => {},
    errors: {},
  };

  const renderFormBody = (
    overrideProps: Partial<FormBodyProps> = {},
    interactedItemIds?: string[],
  ) => {
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

  it('renders values correctly', () => {
    const { getByLabelText } = renderFormBody();

    expect((getByLabelText('Title*') as HTMLInputElement).value).toEqual('A title');
  });

  it('accepts item changes', () => {
    const responseValuesChanged = jest.fn();
    const { getByLabelText } = renderFormBody({ responseValuesChanged });

    fireEvent.change(getByLabelText('Title*'), { target: { value: 'Something' } });
    expect(responseValuesChanged).toHaveBeenCalledTimes(1);
    expect(responseValuesChanged).toHaveBeenCalledWith({ title: 'Something' });
  });

  describe('incomplete item errors', () => {
    it('does not show incomplete item errors on non-interacted items', () => {
      const { getByLabelText } = renderFormBody({ response: { form_response_attrs: {} } });
      expect(getByLabelText('Title*')).not.toHaveClass('is-invalid');
    });

    it('shows errors on interacted items', () => {
      const { getByLabelText } = renderFormBody({ response: { form_response_attrs: {} } }, [
        'title',
      ]);
      expect(getByLabelText('Title*')).toHaveClass('is-invalid');
    });
  });

  describe('string item errors', () => {
    it('shows errors on items', () => {
      const { getByText } = renderFormBody({ errors: { title: ['blah'] } });
      expect(getByText('blah')).toBeVisible();
    });
  });
});
