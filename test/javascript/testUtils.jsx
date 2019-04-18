import React from 'react';
import PropTypes from 'prop-types';
import { ApolloProvider } from 'react-apollo';
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks';
import { render, queries } from 'react-testing-library';

import Confirm from '../../app/javascript/ModalDialogs/Confirm';
import { LazyStripeProvider } from '../../app/javascript/LazyStripe';

function TestWrapper({ apolloClient, stripePublishableKey, children }) {
  return (
    <ApolloProvider client={apolloClient}>
      <ApolloHooksProvider client={apolloClient}>
        <LazyStripeProvider publishableKey={stripePublishableKey}>
          <Confirm>
            {children}
          </Confirm>
        </LazyStripeProvider>
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
    ...otherOptions,
    wrapper: wrapperProps => (
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
  });
}

// re-export everything
export * from 'react-testing-library';

// override render method
export { customRender as render };
