import SignupCountData, {
  EventForSignupCountData,
  GroupedSignupCountForSignupCountData,
} from '../../../app/javascript/EventsApp/SignupCountData';
import { SignupState } from '../../../app/javascript/graphqlTypes.generated';

describe('SignupCountData', () => {
  describe('fromGroupedCounts', () => {
    it('flattens each row’s bucket relation into a bucket_id', () => {
      const groupedCounts: GroupedSignupCountForSignupCountData[] = [
        { bucket: { id: '1' }, count: 3, counted: true, state: SignupState.Confirmed, team_member: false },
      ];
      expect(SignupCountData.fromGroupedCounts(groupedCounts).data).toEqual([
        { bucket_id: '1', count: 3, counted: true, state: SignupState.Confirmed, team_member: false },
      ]);
    });

    it('normalizes a missing or null bucket to a null bucket_id', () => {
      const groupedCounts: GroupedSignupCountForSignupCountData[] = [
        { bucket: null, count: 1, counted: false, state: SignupState.Waitlisted, team_member: false },
      ];
      expect(SignupCountData.fromGroupedCounts(groupedCounts).data[0].bucket_id).toBeNull();
    });
  });

  describe('fromRun', () => {
    it('delegates to fromGroupedCounts using the run’s grouped_signup_counts', () => {
      const run = {
        grouped_signup_counts: [
          { bucket: { id: '1' }, count: 5, counted: true, state: SignupState.Confirmed, team_member: false },
        ],
      };
      expect(SignupCountData.fromRun(run).data).toEqual([
        { bucket_id: '1', count: 5, counted: true, state: SignupState.Confirmed, team_member: false },
      ]);
    });
  });

  describe('filterRows', () => {
    const data = SignupCountData.fromGroupedCounts([
      { bucket: { id: '1' }, count: 3, counted: true, state: SignupState.Confirmed, team_member: false },
      { bucket: { id: '2' }, count: 1, counted: true, state: SignupState.Confirmed, team_member: false },
      { bucket: { id: '3' }, count: 2, counted: false, state: SignupState.Confirmed, team_member: false },
      { bucket: null, count: 4, counted: false, state: SignupState.Waitlisted, team_member: false },
    ]);

    it('filters by a single scalar field value', () => {
      expect(data.filterRows({ counted: true })).toEqual([
        { bucket_id: '1', count: 3, counted: true, state: SignupState.Confirmed, team_member: false },
        { bucket_id: '2', count: 1, counted: true, state: SignupState.Confirmed, team_member: false },
      ]);
    });

    it('matches any element when a field filter is an array, letting rows in different buckets through', () => {
      const rows = data.filterRows({ bucket_id: ['1', '3'] });
      expect(rows.map((row) => row.bucket_id)).toEqual(['1', '3']);
    });

    it('combines multiple field filters as AND', () => {
      const rows = data.filterRows({ bucket_id: ['1', '2', '3'], counted: true });
      expect(rows.map((row) => row.bucket_id)).toEqual(['1', '2']);
    });
  });

  describe('sumSignupCounts', () => {
    it('sums the count field across every matching row', () => {
      const data = SignupCountData.fromGroupedCounts([
        { bucket: { id: '1' }, count: 3, counted: true, state: SignupState.Confirmed, team_member: false },
        { bucket: { id: '2' }, count: 5, counted: true, state: SignupState.Confirmed, team_member: false },
      ]);
      expect(data.sumSignupCounts({ bucket_id: ['1', '2'] })).toEqual(8);
    });

    it('returns 0 when nothing matches', () => {
      const data = SignupCountData.fromGroupedCounts([]);
      expect(data.sumSignupCounts({ state: SignupState.Confirmed })).toEqual(0);
    });
  });

  describe('getConfirmedLimitedSignupCount', () => {
    // Two distinct, real limited buckets (ids 1 and 2) plus a third bucket (id 3) that shares
    // bucket 1's key/name-shaped identity but is a different id entirely -- the whole point of the
    // id-based refactor this data class went through is that matching must never fall back to
    // anything but id, so a would-be key collision here must not double- or mis-count.
    const event: EventForSignupCountData = {
      registration_policy: {
        buckets: [
          { id: '1', slots_limited: true },
          { id: '2', slots_limited: true },
          { id: '3', slots_limited: false },
        ],
      },
    };

    it('sums confirmed, counted signups across multiple limited buckets by id', () => {
      const data = SignupCountData.fromGroupedCounts([
        { bucket: { id: '1' }, count: 3, counted: true, state: SignupState.Confirmed, team_member: false },
        { bucket: { id: '2' }, count: 1, counted: true, state: SignupState.Confirmed, team_member: false },
      ]);
      expect(data.getConfirmedLimitedSignupCount(event)).toEqual(4);
    });

    it('excludes signups in a bucket that is not slots_limited, even though it is a real bucket on this event', () => {
      const data = SignupCountData.fromGroupedCounts([
        { bucket: { id: '1' }, count: 3, counted: true, state: SignupState.Confirmed, team_member: false },
        { bucket: { id: '3' }, count: 100, counted: true, state: SignupState.Confirmed, team_member: false },
      ]);
      expect(data.getConfirmedLimitedSignupCount(event)).toEqual(3);
    });

    it('excludes a bucket id that does not belong to this event’s policy at all', () => {
      const data = SignupCountData.fromGroupedCounts([
        { bucket: { id: '1' }, count: 3, counted: true, state: SignupState.Confirmed, team_member: false },
        {
          bucket: { id: 'other-event-bucket' },
          count: 100,
          counted: true,
          state: SignupState.Confirmed,
          team_member: false,
        },
      ]);
      expect(data.getConfirmedLimitedSignupCount(event)).toEqual(3);
    });

    it('excludes not-counted signups', () => {
      const data = SignupCountData.fromGroupedCounts([
        { bucket: { id: '1' }, count: 3, counted: false, state: SignupState.Confirmed, team_member: false },
      ]);
      expect(data.getConfirmedLimitedSignupCount(event)).toEqual(0);
    });

    it('excludes non-confirmed signups', () => {
      const data = SignupCountData.fromGroupedCounts([
        { bucket: { id: '1' }, count: 3, counted: true, state: SignupState.Waitlisted, team_member: false },
      ]);
      expect(data.getConfirmedLimitedSignupCount(event)).toEqual(0);
    });

    it('returns 0 when the event has no registration policy', () => {
      const data = SignupCountData.fromGroupedCounts([
        { bucket: { id: '1' }, count: 3, counted: true, state: SignupState.Confirmed, team_member: false },
      ]);
      expect(data.getConfirmedLimitedSignupCount({ registration_policy: null })).toEqual(0);
    });
  });

  describe('getNotCountedConfirmedSignupCount', () => {
    it('sums not-counted confirmed non-team-member signups across every bucket', () => {
      const data = SignupCountData.fromGroupedCounts([
        { bucket: { id: '1' }, count: 2, counted: false, state: SignupState.Confirmed, team_member: false },
        { bucket: { id: '2' }, count: 3, counted: false, state: SignupState.Confirmed, team_member: false },
      ]);
      expect(data.getNotCountedConfirmedSignupCount()).toEqual(5);
    });

    it('excludes team members', () => {
      const data = SignupCountData.fromGroupedCounts([
        { bucket: { id: '1' }, count: 2, counted: false, state: SignupState.Confirmed, team_member: true },
      ]);
      expect(data.getNotCountedConfirmedSignupCount()).toEqual(0);
    });
  });

  describe('getWaitlistCount', () => {
    it('sums waitlisted non-team-member signups regardless of bucket', () => {
      const data = SignupCountData.fromGroupedCounts([
        { bucket: { id: '1' }, count: 2, counted: false, state: SignupState.Waitlisted, team_member: false },
        { bucket: null, count: 3, counted: false, state: SignupState.Waitlisted, team_member: false },
      ]);
      expect(data.getWaitlistCount()).toEqual(5);
    });
  });

  describe('runFull', () => {
    const buildEvent = (overrides: Partial<NonNullable<EventForSignupCountData['registration_policy']>> = {}) => ({
      registration_policy: {
        buckets: [{ id: '1', slots_limited: true }],
        slots_limited: true,
        total_slots: 2,
        ...overrides,
      },
    });

    it('is true when confirmed limited signups across buckets exactly fill total_slots', () => {
      const event = {
        registration_policy: {
          buckets: [
            { id: '1', slots_limited: true },
            { id: '2', slots_limited: true },
          ],
          slots_limited: true,
          total_slots: 2,
        },
      };
      const data = SignupCountData.fromGroupedCounts([
        { bucket: { id: '1' }, count: 1, counted: true, state: SignupState.Confirmed, team_member: false },
        { bucket: { id: '2' }, count: 1, counted: true, state: SignupState.Confirmed, team_member: false },
      ]);
      expect(data.runFull(event)).toBe(true);
    });

    it('is false when under capacity', () => {
      const data = SignupCountData.fromGroupedCounts([
        { bucket: { id: '1' }, count: 1, counted: true, state: SignupState.Confirmed, team_member: false },
      ]);
      expect(data.runFull(buildEvent())).toBe(false);
    });

    it('is false when the policy is not slots_limited', () => {
      const data = SignupCountData.fromGroupedCounts([
        { bucket: { id: '1' }, count: 2, counted: true, state: SignupState.Confirmed, team_member: false },
      ]);
      expect(data.runFull(buildEvent({ slots_limited: false }))).toBe(false);
    });

    it('is false when there is no registration policy', () => {
      const data = SignupCountData.fromGroupedCounts([]);
      expect(data.runFull({ registration_policy: null })).toBe(false);
    });

    it('is false when total_slots is null', () => {
      const data = SignupCountData.fromGroupedCounts([]);
      expect(data.runFull(buildEvent({ total_slots: null }))).toBe(false);
    });
  });
});
