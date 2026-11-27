import { index, layout, route } from '@react-router/dev/routes';
import { NamedRoute } from '../NamedRoute';

export default route('/admin_events', 'EventAdmin/index.tsx', { id: NamedRoute.EventAdmin }, [
  layout('EventAdmin/singleEventGuard.ts', [route(':eventId/edit', 'EventAdmin/EventAdminEditEvent.tsx')]),
  layout('EventAdmin/multipleEventsGuard.ts', [
    route('dropped_events', 'EventAdmin/DroppedEventAdmin.tsx'),
    route(':eventCategoryId', 'EventAdmin/categoryRoute.ts', [
      route('events/new', 'EventAdmin/NewEvent.tsx'),
      route('events/:eventId/edit', 'EventAdmin/EventAdminEditEvent.tsx', {
        id: 'EventAdmin/EventAdminEditEvent#2',
      }),
      route('', 'EventAdmin/CategorySpecificEventAdmin.tsx', [
        route('events', 'EventAdmin/create.ts', [
          index('EventAdmin/redirectToCategory.ts'),
          route(':eventId', 'EventAdmin/$id.ts', [
            route('admin_notes', 'EventAdmin/AdminNotesRoute.ts'),
            route('drop', 'EventAdmin/drop.ts'),
            route('restore', 'EventAdmin/RestoreEventRoute.ts'),
            route('runs', 'EventAdmin/runsRoute.ts', [
              route(':runId', 'EventAdmin/SingleRunRoute.ts', [route('edit', 'EventAdmin/EditRun.tsx')]),
              route('create_multiple', 'EventAdmin/CreateMultipleRunsRoute.ts'),
              route('new', 'EventAdmin/NewRun.tsx'),
            ]),
          ]),
        ]),
      ]),
    ]),
  ]),
  index('EventAdmin/rootRedirect.ts'),
]);
