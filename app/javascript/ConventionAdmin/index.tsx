import { useMemo } from 'react';
import { ApolloError } from '@apollo/client';
import { redirect, useActionData, useSubmit } from 'react-router';
import pick from 'lodash/pick';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import ConventionForm, { ConventionFormConvention } from './ConventionForm';
import ConventionFormHeader from './ConventionFormHeader';
import usePageTitle from '../usePageTitle';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';
import { ConventionAdminConventionQueryData, ConventionAdminConventionQueryDocument } from './queries.generated';
import { ConventionInput } from '../graphqlTypes.generated';
import { UpdateConventionDocument } from './mutations.generated';
import { Route } from './+types/index';
import { apolloClientContext } from 'AppContexts';

export const action = async ({ request, context }: Route.ActionArgs) => {
  try {
    const formData = await request.formData();
    const favicon = formData.get('favicon') as File | null;
    const openGraphImage = formData.get('openGraphImage') as File | null;
    const convention = JSON.parse(formData.get('convention')?.toString() ?? '{}') as ConventionFormConvention;

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
      ...(favicon == null ? {} : { favicon }),
      ...(openGraphImage == null ? {} : { openGraphImage }),
    };

    await context.get(apolloClientContext).mutate({
      mutation: UpdateConventionDocument,
      variables: {
        input: {
          convention: conventionInput,
        },
      },
    });
  } catch (error) {
    return error;
  }

  await context.get(apolloClientContext).resetStore();
  return redirect('/');
};

export const loader = async ({ context }: Route.LoaderArgs) => {
  const { data } = await context.get(apolloClientContext).query<ConventionAdminConventionQueryData>({
    query: ConventionAdminConventionQueryDocument,
  });
  return data;
};

function ConventionAdmin({ loaderData: data }: Route.ComponentProps) {
  const authorizationWarning = useAuthorizationRequired('can_update_convention');
  const submit = useSubmit();
  const mutationError = useActionData();

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
    const formData = new FormData();
    formData.set('convention', JSON.stringify(convention));
    if (openGraphImage) {
      formData.set('openGraphImage', openGraphImage);
    }
    if (favicon) {
      formData.set('favicon', favicon);
    }
    submit(formData, { method: 'PATCH', action: '.', encType: 'multipart/form-data' });
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

export default ConventionAdmin;
