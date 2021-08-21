import { useMemo } from 'react';
import { ApolloError, useApolloClient } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import pick from 'lodash/pick';
import { ErrorDisplay, PageLoadingIndicator } from '@neinteractiveliterature/litform';

import ConventionForm, { ConventionFormConvention } from './ConventionForm';
import useAsyncFunction from '../useAsyncFunction';
import ConventionFormHeader from './ConventionFormHeader';
import usePageTitle from '../usePageTitle';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';
import { useConventionAdminConventionQuery } from './queries.generated';
import { useUpdateConventionMutation } from './mutations.generated';
import { ConventionInput } from '../graphqlTypes.generated';
import { EditingScheduledValue } from '../BuiltInFormControls/ScheduledValueEditor';
import { MaximumEventSignupsValue } from './MaximumEventSignupsPreview';

function ConventionAdmin() {
  const history = useHistory();
  const { data, loading, error } = useConventionAdminConventionQuery();
  const [updateMutate] = useUpdateConventionMutation();
  const [mutate, mutationError] = useAsyncFunction(updateMutate);
  const apolloClient = useApolloClient();
  const authorizationWarning = useAuthorizationRequired('can_update_convention');

  const initialConvention: ConventionFormConvention | undefined = useMemo(() => {
    if (loading || error || !data) {
      return undefined;
    }

    return {
      ...data.convention,
      maximum_event_signups: data.convention.maximum_event_signups
        ? (data.convention.maximum_event_signups as EditingScheduledValue<MaximumEventSignupsValue>)
        : { timespans: [] },
    };
  }, [data, loading, error]);

  usePageTitle('Convention Settings');

  if (authorizationWarning) return authorizationWarning;

  const saveConvention = async (convention: ConventionFormConvention) => {
    const conventionInput: ConventionInput = {
      ...pick(convention, [
        'accepting_proposals',
        'starts_at',
        'ends_at',
        'name',
        'domain',
        'email_from',
        'email_mode',
        'event_mailing_list_domain',
        'location',
        'timezone_name',
        'timezone_mode',
        'show_schedule',
        'show_event_list',
        'maximum_tickets',
        'signup_mode',
        'signup_requests_open',
        'site_mode',
        'hidden',
        'ticket_name',
        'ticket_mode',
        'clickwrap_agreement',
        'language',
      ]),
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
    return <PageLoadingIndicator visible iconSet="bootstrap-icons" />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <div className="mb-4">
      <div className="mb-4">
        <ConventionFormHeader convention={data!.convention} compact />
      </div>

      <ConventionForm
        initialConvention={initialConvention!}
        saveConvention={saveConvention}
        cmsLayouts={data!.convention.cms_layouts}
        pages={data!.convention.pages}
        rootSite={data!.rootSite}
      />

      <ErrorDisplay graphQLError={mutationError as ApolloError} />
    </div>
  );
}

export default ConventionAdmin;
