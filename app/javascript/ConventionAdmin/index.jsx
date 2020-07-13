import React from 'react';
import PropTypes from 'prop-types';
import { useApolloClient, useMutation, useQuery } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';
import pick from 'lodash/pick';

import { ConventionAdminConventionQuery } from './queries.gql';
import ConventionForm from './ConventionForm';
import ErrorDisplay from '../ErrorDisplay';
import { UpdateConvention } from './mutations.gql';
import useAsyncFunction from '../useAsyncFunction';
import ConventionFormHeader from './ConventionFormHeader';
import usePageTitle from '../usePageTitle';
import PageLoadingIndicator from '../PageLoadingIndicator';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';

function ConventionAdmin({ id }) {
  const history = useHistory();
  const { data, loading, error } = useQuery(ConventionAdminConventionQuery, { variables: { id } });
  const [updateMutate] = useMutation(UpdateConvention);
  const [mutate, mutationError] = useAsyncFunction(updateMutate);
  const apolloClient = useApolloClient();
  const authorizationWarning = useAuthorizationRequired('can_update_convention');

  usePageTitle('Convention Settings');

  if (authorizationWarning) return authorizationWarning;

  const saveConvention = async (convention) => {
    const conventionInput = {
      ...pick(
        convention,
        [
          'accepting_proposals', 'starts_at', 'ends_at', 'name', 'domain', 'email_from',
          'email_mode', 'event_mailing_list_domain', 'location', 'timezone_name', 'timezone_mode',
          'show_schedule', 'show_event_list', 'maximum_tickets', 'signup_mode',
          'signup_requests_open', 'site_mode', 'hidden', 'ticket_name', 'ticket_mode',
          'clickwrap_agreement', 'language',
        ],
      ),
      maximum_event_signups: {
        timespans: convention.maximum_event_signups.timespans.map((timespan) => ({
          start: timespan.start,
          finish: timespan.finish,
          string_value: timespan.value,
        })),
      },
      default_layout_id: (convention.default_layout || {}).id,
      root_page_id: (convention.root_page || {}).id,
      catch_all_staff_position_id: (convention.catch_all_staff_position || {}).id,
      stripe_publishable_key: convention.stripe_publishable_key,
      ...(
        convention.stripe_secret_key
          ? { stripe_secret_key: convention.stripe_secret_key }
          : {}
      ),
    };
    await mutate({
      variables: {
        input: {
          convention: conventionInput,
        },
      },
    });

    await apolloClient.resetStore();
    history.push('/');
  };

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <div className="mb-4">
      <div className="mb-4">
        <ConventionFormHeader convention={data.convention} compact />
      </div>

      <ConventionForm
        initialConvention={{ ...data.convention }}
        saveConvention={saveConvention}
        cmsLayouts={data.convention.cms_layouts}
        pages={data.convention.pages}
        rootSite={data.rootSite}
      />

      <ErrorDisplay error={mutationError} />
    </div>
  );
}

ConventionAdmin.propTypes = {
  id: PropTypes.number,
};

ConventionAdmin.defaultProps = {
  id: null,
};

export default ConventionAdmin;
