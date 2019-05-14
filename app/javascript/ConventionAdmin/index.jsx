import React from 'react';
import PropTypes from 'prop-types';
import { useApolloClient } from 'react-apollo-hooks';

import { ConventionAdminConventionQuery } from './queries.gql';
import ConventionForm from './ConventionForm';
import ErrorDisplay from '../ErrorDisplay';
import { UpdateConvention } from './mutations.gql';
import useAsyncFunction from '../useAsyncFunction';
import useQuerySuspended from '../useQuerySuspended';
import useMutationCallback from '../useMutationCallback';
import ConventionFormHeader from './ConventionFormHeader';

function ConventionAdmin({ id, history }) {
  const { data, error } = useQuerySuspended(ConventionAdminConventionQuery, { variables: { id } });
  const [mutate, mutationError] = useAsyncFunction(useMutationCallback(UpdateConvention));
  const apolloClient = useApolloClient();

  const saveConvention = async (convention) => {
    await mutate({
      variables: {
        input: {
          convention: {
            accepting_proposals: convention.accepting_proposals,
            starts_at: convention.starts_at,
            ends_at: convention.ends_at,
            name: convention.name,
            domain: convention.domain,
            event_mailing_list_domain: convention.event_mailing_list_domain,
            timezone_name: convention.timezone_name,
            show_schedule: convention.show_schedule,
            show_event_list: convention.show_event_list,
            maximum_tickets: convention.maximum_tickets,
            ticket_name: convention.ticket_name,
            ticket_mode: convention.ticket_mode,
            maximum_event_signups: {
              timespans: convention.maximum_event_signups.timespans.map(timespan => ({
                start: timespan.start,
                finish: timespan.finish,
                string_value: timespan.value,
              })),
            },
            default_layout_id: (convention.default_layout || {}).id,
            root_page_id: (convention.root_page || {}).id,
            stripe_publishable_key: convention.stripe_publishable_key,
            ...(
              convention.stripe_secret_key
                ? { stripe_secret_key: convention.stripe_secret_key }
                : {}
            ),
            clickwrap_agreement: convention.clickwrap_agreement,
          },
        },
      },
    });

    await apolloClient.resetStore();
    history.push('/');
  };

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <div className="mb-4">
      <ConventionFormHeader convention={data.convention} />

      <ConventionForm
        initialConvention={{ ...data.convention }}
        saveConvention={saveConvention}
        cmsLayouts={data.convention.cms_layouts}
        pages={data.convention.pages}
      />

      <ErrorDisplay error={mutationError} />
    </div>
  );
}

ConventionAdmin.propTypes = {
  id: PropTypes.number,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

ConventionAdmin.defaultProps = {
  id: null,
};

export default ConventionAdmin;
