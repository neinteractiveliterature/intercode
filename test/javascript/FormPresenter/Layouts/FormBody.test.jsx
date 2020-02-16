import React from 'react';

import { render, fireEvent } from '../../testUtils';
import { convention, minimalForm } from '../../EventAdmin/formMockData';
import FormBody from '../../../../app/javascript/FormPresenter/Layouts/FormBody';
import { ItemInteractionTrackerContext } from '../../../../app/javascript/FormPresenter/ItemInteractionTracker';

describe('FormBody', () => {
  const defaultProps = {
    formItems: minimalForm.getAllItems(),
    convention,
    response: { title: 'A title' },
    responseValuesChanged: () => {},
    errors: {},
  };

  const renderFormBody = (overrideProps = {}, interactedItemIds = null) => {
    const interactedItemIdsSet = new Set(interactedItemIds || []);
    return render((
      <ItemInteractionTrackerContext.Provider
        value={{
          hasInteractedWithItem: (id) => interactedItemIdsSet.has(id),
          interactWithItem: () => { },
          interactedItemIds: interactedItemIdsSet,
        }}
      >
        <FormBody {...defaultProps} {...overrideProps} />
      </ItemInteractionTrackerContext.Provider>
    ));
  };

  it('renders values correctly', () => {
    const { getByLabelText } = renderFormBody();

    expect(getByLabelText('Title*').value).toEqual('A title');
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
      const { getByLabelText } = renderFormBody({ response: {} });
      expect(getByLabelText('Title*')).not.toHaveClass('is-invalid');
    });

    it('shows errors on interacted items', () => {
      const { getByLabelText } = renderFormBody({ response: {} }, ['title']);
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
