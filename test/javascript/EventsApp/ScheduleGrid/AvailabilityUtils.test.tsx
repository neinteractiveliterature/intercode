import { calculateAvailability } from '../../../../app/javascript/EventsApp/ScheduleGrid/AvailabilityUtils';
import SignupCountData from '../../../../app/javascript/EventsApp/SignupCountData';
import { ScheduleEvent } from '../../../../app/javascript/EventsApp/ScheduleGrid/Schedule';
import { SignupState } from '../../../../app/javascript/graphqlTypes.generated';

// calculateAvailability only ever reads event.registration_policy -- ScheduleEvent is a much wider
// fragment type (event_category, runs, etc.) that isn't relevant here, so this builds just the
// slice the function actually touches rather than a full fixture for the whole fragment.
function buildEvent(registrationPolicy: ScheduleEvent['registration_policy']): ScheduleEvent {
  return { registration_policy: registrationPolicy } as unknown as ScheduleEvent;
}

describe('calculateAvailability', () => {
  it('sums confirmed signups in limited buckets when the policy has an overall total_slots', () => {
    const event = buildEvent({
      slots_limited: true,
      only_uncounted: false,
      total_slots: 10,
      total_slots_including_not_counted: 10,
      buckets: [
        {
          __typename: 'RegistrationPolicyBucket' as const,
          id: '1',
          key: 'player',
          not_counted: false,
          total_slots: 6,
          slots_limited: true,
        },
        {
          __typename: 'RegistrationPolicyBucket' as const,
          id: '2',
          key: 'gm',
          not_counted: false,
          total_slots: 4,
          slots_limited: true,
        },
      ],
    });
    const signupCountData = new SignupCountData([
      { bucket_id: '1', count: 3, counted: true, state: SignupState.Confirmed, team_member: false },
      { bucket_id: '2', count: 1, counted: true, state: SignupState.Confirmed, team_member: false },
      // A bucket with a different id must not be counted towards this event's availability, even
      // if some other bug caused it to share data with one of the buckets above.
      { bucket_id: 'other-event-bucket', count: 100, counted: true, state: SignupState.Confirmed, team_member: false },
    ]);

    const availability = calculateAvailability(event, signupCountData);

    expect(availability.totalSlots).toEqual(10);
    expect(availability.signupCount).toEqual(4);
    expect(availability.remainingCapacity).toEqual(6);
    expect(availability.unlimited).toBe(false);
  });

  it('only sums the limited buckets when only_uncounted and some buckets are unlimited', () => {
    const event = buildEvent({
      slots_limited: true,
      only_uncounted: true,
      total_slots: null,
      total_slots_including_not_counted: 5,
      buckets: [
        {
          __typename: 'RegistrationPolicyBucket' as const,
          id: '1',
          key: 'limited',
          not_counted: true,
          total_slots: 5,
          slots_limited: true,
        },
        {
          __typename: 'RegistrationPolicyBucket' as const,
          id: '2',
          key: 'unlimited',
          not_counted: true,
          total_slots: null,
          slots_limited: false,
        },
      ],
    });
    const signupCountData = new SignupCountData([
      { bucket_id: '1', count: 2, counted: true, state: SignupState.Confirmed, team_member: false },
      { bucket_id: '2', count: 40, counted: true, state: SignupState.Confirmed, team_member: false },
    ]);

    const availability = calculateAvailability(event, signupCountData);

    expect(availability.totalSlots).toEqual(5);
    expect(availability.signupCount).toEqual(2);
  });

  it('is unlimited when the registration policy is not slots_limited', () => {
    const event = buildEvent({
      slots_limited: false,
      only_uncounted: false,
      total_slots: null,
      total_slots_including_not_counted: null,
      buckets: [],
    });
    const availability = calculateAvailability(event, new SignupCountData([]));

    expect(availability.unlimited).toBe(true);
  });

  it('reports the waitlist count regardless of bucket', () => {
    const event = buildEvent({
      slots_limited: true,
      only_uncounted: false,
      total_slots: 1,
      total_slots_including_not_counted: 1,
      buckets: [
        {
          __typename: 'RegistrationPolicyBucket' as const,
          id: '1',
          key: 'player',
          not_counted: false,
          total_slots: 1,
          slots_limited: true,
        },
      ],
    });
    const signupCountData = new SignupCountData([
      { bucket_id: '1', count: 1, counted: true, state: SignupState.Confirmed, team_member: false },
      { bucket_id: null, count: 3, counted: false, state: SignupState.Waitlisted, team_member: false },
    ]);

    expect(calculateAvailability(event, signupCountData).waitlistCount).toEqual(3);
  });
});
