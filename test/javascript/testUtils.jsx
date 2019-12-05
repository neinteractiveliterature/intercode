/* eslint-disable import/export */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { ApolloProvider } from 'react-apollo';
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks';
import { render, queries } from '@testing-library/react';

import Confirm from '../../app/javascript/ModalDialogs/Confirm';
import { LazyStripeContext } from '../../app/javascript/LazyStripe';

function TestWrapper({ apolloClient, stripePublishableKey, children }) {
  const lazyStripeProviderValue = useMemo(
    () => ({ publishableKey: stripePublishableKey }),
    [stripePublishableKey],
  );
  return (
    <ApolloProvider client={apolloClient}>
      <ApolloHooksProvider client={apolloClient}>
        <LazyStripeContext.Provider value={lazyStripeProviderValue}>
          <Confirm>
            {children}
          </Confirm>
        </LazyStripeContext.Provider>
      </ApolloHooksProvider>
    </ApolloProvider>
  );
}

TestWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  apolloClient: PropTypes.shape({}).isRequired,
  stripePublishableKey: PropTypes.string,
};

TestWrapper.defaultProps = {
  stripePublishableKey: null,
};

function customRender(ui, options = {}) {
  const { apolloClient, stripePublishableKey, ...otherOptions } = options;
  return render(ui, {
    wrapper: (wrapperProps) => (
      <TestWrapper
        apolloClient={apolloClient || { query: () => {} }}
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
