import { index, layout, route } from '@react-router/dev/routes';
import { NamedRoute } from '../NamedRoute';

export default route('/events', 'EventsApp/route.ts', [
  layout('EventsApp/multipleEventsGuard.ts', [
    route('schedule', 'EventsApp/scheduleRoute.ts', [
      route(':day', 'EventsApp/ScheduleApp.tsx'),
      index('EventsApp/redirectToFirstDay.ts'),
    ]),
    route('schedule_by_room/*', 'EventsApp/redirectToSchedule.ts'),
    route('schedule_with_counts/*', 'EventsApp/redirectToSchedule.ts', { id: 'EventsApp/redirectToSchedule#2' }),
    route('table', 'EventsApp/EventCatalog/EventTable/index.tsx'),
    index('EventsApp/EventCatalog/EventList/index.tsx'),
  ]),
  layout('EventsApp/rankedChoiceGuard.ts', [route('my-signup-queue', 'EventsApp/MySignupQueue/index.tsx')]),
  route(':eventId', 'EventsApp/eventRoute.ts', { id: NamedRoute.Event }, [
    route('attach_image', 'EventsApp/attach_image.ts'),
    layout('EventsApp/ticketPerEventGuard.ts', [
      route('ticket_types', 'EventsApp/EventTicketTypesWrapper.tsx', [
        route('new', 'EventsApp/ticketTypes/newRoute.ts'),
        route(':id/edit', 'EventsApp/ticketTypes/editRoute.ts'),
        index('EventsApp/ticketTypes/indexRoute.ts'),
      ]),
    ]),
    route('edit', 'EventsApp/StandaloneEditEvent/guard.ts', [index('EventsApp/StandaloneEditEvent/index.tsx')]),
    route('maximum_event_provided_ticket_overrides', 'EventsApp/MaximumEventProvidedTicketsOverrides/route.ts', [
      route(':id', 'EventsApp/MaximumEventProvidedTicketsOverrides/$id.ts'),
    ]),
    route('team_members', 'EventsApp/TeamMemberAdmin/index.tsx', { id: NamedRoute.TeamMembers }, [
      route('new', 'EventsApp/TeamMemberAdmin/NewTeamMember.tsx', { id: NamedRoute.NewTeamMember }),
      route(':teamMemberId', 'EventsApp/TeamMemberAdmin/EditTeamMember.tsx', {
        id: NamedRoute.EditTeamMember,
      }),
      route('', 'EventsApp/TeamMemberAdmin/TeamMembersIndex.tsx', { id: NamedRoute.TeamMembersIndex }, [
        route(':teamMemberId/provide_ticket', 'EventsApp/TeamMemberAdmin/ProvideTicketModal.tsx'),
      ]),
    ]),
    route('history', 'EventsApp/EventPage/EventHistory.tsx', { id: 'EventsApp/EventPage/EventHistory#2' }, [
      route(':changeGroupId', 'EventsApp/EventPage/EventHistory.tsx'),
    ]),
    route('runs/:runId', 'EventsApp/SignupAdmin/RunHeader.tsx', [
      route('admin_signups', 'EventsApp/SignupAdmin/route.ts', { id: NamedRoute.SignupAdmin }, [
        route(':id', 'EventsApp/SignupAdmin/$id/route.tsx', { id: NamedRoute.EditSignup }, [
          route('change_bucket', 'EventsApp/SignupAdmin/$id/change_bucket.tsx'),
          route('force_confirm', 'EventsApp/SignupAdmin/$id/force_confirm.tsx'),
        ]),
        layout('EventsApp/SignupAdmin/SignupsIndex.tsx', [
          route('emails/:separator', 'EventsApp/SignupAdmin/RunEmailList.tsx', {
            id: NamedRoute.RunEmailList,
          }),
          route('signup_changes', 'EventsApp/SignupAdmin/RunSignupChangesTable.tsx', {
            id: NamedRoute.RunSignupChangesTable,
          }),
          index('EventsApp/SignupAdmin/RunSignupsTable.tsx', { id: NamedRoute.RunSignupsTable }),
        ]),
      ]),
      route('signup_summary', 'EventsApp/SignupAdmin/RunSignupSummary.tsx', {
        id: NamedRoute.RunSignupSummary,
      }),
    ]),
    route('', 'EventsApp/EventPage/guard.ts', [index('EventsApp/EventPage/index.tsx', { id: NamedRoute.EventPage })]),
  ]),
]);
