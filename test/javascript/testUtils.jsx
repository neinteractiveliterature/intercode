/* eslint-disable import/export */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { MockedProvider } from '@apollo/react-testing';
import { render, queries } from '@testing-library/react';

import Confirm from '../../app/javascript/ModalDialogs/Confirm';
import { LazyStripeContext } from '../../app/javascript/LazyStripe';

function TestWrapper({ apolloMocks, stripePublishableKey, children }) {
  const lazyStripeProviderValue = useMemo(
    () => ({ publishableKey: stripePublishableKey }),
    [stripePublishableKey],
  );
  return (
    <MockedProvider mocks={apolloMocks}>
      <LazyStripeContext.Provider value={lazyStripeProviderValue}>
        <Confirm>
          {children}
        </Confirm>
      </LazyStripeContext.Provider>
    </MockedProvider>
  );
}

TestWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  apolloMocks: PropTypes.arrayOf(PropTypes.shape({})),
  stripePublishableKey: PropTypes.string,
};

TestWrapper.defaultProps = {
  stripePublishableKey: null,
  apolloMocks: null,
};

function customRender(ui, options = {}) {
  const { apolloMocks, stripePublishableKey, ...otherOptions } = options;
  return render(ui, {
    wrapper: (wrapperProps) => (
      <TestWrapper
        apolloMocks={apolloMocks}
        stripePublishableKey={stripePublishableKey}
        {...wrapperProps}
      />
    ),
    queries: {
      ...queries,
      getMultipleChoiceInput: (container, formGroupLegendText, labelText) => {
        const formGroup = queries.getByText(container, formGroupLegendText, { selector: 'legend' })
          .closest('.form-group');
        return queries.getByLabelText(formGroup, labelText);
      },
    },
    ...otherOptions,
  });
}

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
