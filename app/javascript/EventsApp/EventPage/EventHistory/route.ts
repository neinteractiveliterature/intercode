import { apolloClientContext } from '~/AppContexts';
import { Route } from './+types/route';
import { EventHistoryQueryDocument } from '../eventHistoryQuery.generated';
import { useRouteLoaderData } from 'react-router';
import { NamedRoute } from '~/routes';
import { buildChangeGroups } from '~/FormPresenter/ItemChangeDisplays/FormItemChangeUtils';

const EXCLUDE_FIELDS = new Set([
  'minimum_age',
  'age_restrictions_description',
  'con_mail_destination',
  'email',
  'team_mailing_list_name',
]);

export const clientLoader = async ({ params: { eventId }, context }: Route.ClientLoaderArgs) => {
  const client = context.get(apolloClientContext);
  const { data, error } = await client.query({
    query: EventHistoryQueryDocument,
    variables: { id: eventId ?? '' },
  });
  if (!data) {
    throw error;
  }
  const changes = data.convention.event.form_response_changes.filter(
    (change) => !EXCLUDE_FIELDS.has(change.field_identifier),
  );
  const changeGroups = buildChangeGroups(changes, data.convention.event.event_category.event_form);
  return { data, changes, changeGroups };
};

export function useEventHistoryLoaderData() {
  return useRouteLoaderData(NamedRoute.EventHistory) as Route.ComponentProps['loaderData'];
}
