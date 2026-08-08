import { RegistrationPolicyBucket, SignupState } from '../graphqlTypes.generated';

export type GroupedSignupCountForSignupCountData = {
  bucket?: Pick<RegistrationPolicyBucket, 'id'> | null;
  count: number;
  counted: boolean;
  state: SignupState;
  team_member: boolean;
};

// The generic filter mechanism below compares plain field values, so a nested bucket relation is
// flattened into a synthetic bucket_id at construction time rather than filtered directly.
type NormalizedGroupedSignupCount = {
  bucket_id: string | null;
  count: number;
  counted: boolean;
  state: SignupState;
  team_member: boolean;
};

export type SignupCountFieldFilter<T> = T | T[] | undefined;

export type SignupCountDataFilter = {
  [Field in keyof NormalizedGroupedSignupCount]?: SignupCountFieldFilter<NormalizedGroupedSignupCount[Field]>;
};

export type SignupCountsByBucketKeyAndCounted = {
  [bucketKey: string]: {
    counted?: number;
    not_counted?: number;
  };
};

export type EventForSignupCountData = {
  registration_policy?: null | {
    buckets: { id: string; slots_limited: boolean }[];
    total_slots?: number | null;
    slots_limited?: boolean | null;
  };
};

export default class SignupCountData {
  data: NormalizedGroupedSignupCount[];

  static fromRun(run: { grouped_signup_counts: GroupedSignupCountForSignupCountData[] }): SignupCountData {
    return SignupCountData.fromGroupedCounts(run.grouped_signup_counts);
  }

  static fromGroupedCounts(groupedCounts: GroupedSignupCountForSignupCountData[]): SignupCountData {
    return new SignupCountData(
      groupedCounts.map((row) => ({
        bucket_id: row.bucket?.id ?? null,
        count: row.count,
        counted: row.counted,
        state: row.state,
        team_member: row.team_member,
      })),
    );
  }

  constructor(data: NormalizedGroupedSignupCount[]) {
    this.data = data;
  }

  filterRows(filters: SignupCountDataFilter): NormalizedGroupedSignupCount[] {
    return Object.entries(filters).reduce((filteredData, [field, value]) => {
      if (Array.isArray(value)) {
        return filteredData.filter((row) => (value as unknown[]).includes(row[field as keyof SignupCountDataFilter]));
      }

      return filteredData.filter((row) => value === row[field as keyof SignupCountDataFilter]);
    }, this.data);
  }

  sumSignupCounts(filters: SignupCountDataFilter): number {
    return this.filterRows(filters)
      .map((row) => row.count)
      .reduce((sum, count) => sum + count, 0);
  }

  getConfirmedLimitedSignupCount(event: EventForSignupCountData): number {
    if (!event.registration_policy) {
      return 0;
    }

    const limitedBuckets = event.registration_policy.buckets.filter((bucket) => bucket.slots_limited);
    return this.sumSignupCounts({
      state: SignupState.Confirmed,
      bucket_id: limitedBuckets.map((bucket) => bucket.id),
      counted: true,
    });
  }

  getNotCountedConfirmedSignupCount(): number {
    return this.sumSignupCounts({ state: SignupState.Confirmed, counted: false, team_member: false });
  }

  getWaitlistCount(): number {
    return this.sumSignupCounts({ state: SignupState.Waitlisted, team_member: false });
  }

  runFull(event: EventForSignupCountData): boolean {
    if (!event.registration_policy) {
      return false;
    }

    const { total_slots: totalSlots, slots_limited: slotsLimited } = event.registration_policy;
    return !!(
      slotsLimited &&
      totalSlots &&
      totalSlots > 0 &&
      this.getConfirmedLimitedSignupCount(event) === totalSlots
    );
  }
}
