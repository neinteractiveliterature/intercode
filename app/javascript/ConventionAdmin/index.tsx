import { useMemo } from 'react';
import { ApolloError, useApolloClient } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import pick from 'lodash/pick';
import { ErrorDisplay, LoadQueryWrapper } from '@neinteractiveliterature/litform';

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

export default LoadQueryWrapper(useConventionAdminConventionQuery, function ConventionAdmin({ data }) {
  const navigate = useNavigate();
  const [updateMutate] = useUpdateConventionMutation();
  const [mutate, mutationError] = useAsyncFunction(updateMutate);
  const apolloClient = useApolloClient();
  const authorizationWarning = useAuthorizationRequired('can_update_convention');

  const initialConvention: ConventionFormConvention = useMemo(() => {
    return {
      ...data.convention,
      maximum_event_signups: data.convention.maximum_event_signups
        ? (data.convention.maximum_event_signups as EditingScheduledValue<MaximumEventSignupsValue>)
        : { timespans: [] },
    };
  }, [data]);

  usePageTitle('Convention Settings');

  if (authorizationWarning) return authorizationWarning;

  const saveConvention = async (
    convention: ConventionFormConvention,
    openGraphImage: File | null | undefined,
    favicon: File | null | undefined,
  ) => {
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
        'signup_automation_mode',
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
      defaultLayoutId: convention.defaultLayout?.id.toString(),
      rootPageId: convention.rootPage.id.toString(),
      catchAllStaffPositionId: convention.catch_all_staff_position?.id.toString(),
      defaultCurrencyCode: convention.default_currency_code,
      ...(typeof favicon === 'undefined' ? {} : { favicon }),
      ...(typeof openGraphImage === 'undefined' ? {} : { openGraphImage }),
    };
    await mutate({
      variables: {
        input: {
          convention: conventionInput,
        },
      },
    });

    await apolloClient.resetStore();
    navigate('/');
  };

  return (
    <div className="mb-4">
      <div className="mb-4">
        <ConventionFormHeader convention={data.convention} compact />
      </div>

      <ConventionForm
        initialConvention={initialConvention}
        saveConvention={saveConvention}
        cmsLayouts={data.convention.cmsLayouts}
        pages={data.convention.cmsPages}
        rootSite={data.rootSite}
      />

      <ErrorDisplay graphQLError={mutationError as ApolloError} />
    </div>
  );
});
