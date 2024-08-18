import { useMemo } from 'react';
import { ApolloError, useApolloClient } from '@apollo/client';
import { LoaderFunction, useLoaderData, useNavigate } from 'react-router-dom';
import pick from 'lodash/pick';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import ConventionForm, { ConventionFormConvention } from './ConventionForm';
import useAsyncFunction from '../useAsyncFunction';
import ConventionFormHeader from './ConventionFormHeader';
import usePageTitle from '../usePageTitle';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';
import { ConventionAdminConventionQueryData, ConventionAdminConventionQueryDocument } from './queries.generated';
import { useUpdateConventionMutation } from './mutations.generated';
import { ConventionInput } from '../graphqlTypes.generated';
import { client } from '../useIntercodeApolloClient';

export const loader: LoaderFunction = async () => {
  const { data } = await client.query<ConventionAdminConventionQueryData>({
    query: ConventionAdminConventionQueryDocument,
  });
  return data;
};

function ConventionAdmin() {
  const data = useLoaderData() as ConventionAdminConventionQueryData;
  const navigate = useNavigate();
  const [updateMutate] = useUpdateConventionMutation();
  const [mutate, mutationError] = useAsyncFunction(updateMutate);
  const apolloClient = useApolloClient();
  const authorizationWarning = useAuthorizationRequired('can_update_convention');

  const initialConvention: ConventionFormConvention = useMemo(() => {
    return {
      ...data.convention,
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
}

export const Component = ConventionAdmin;
