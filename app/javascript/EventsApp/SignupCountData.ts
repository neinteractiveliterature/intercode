import { GroupedSignupCount, SignupState } from '../graphqlTypes.generated';

export type SignupCountDataFilter = {
  state?: SignupState | SignupState[];
  bucket_key?: string | string[];
  counted?: boolean | boolean[];
};

export type SignupCountsByBucketKeyAndCounted = {
  [bucketKey: string]: {
    counted?: number;
    not_counted?: number;
  };
};

export type EventForSignupCountData = {
  registration_policy?: null | {
    buckets: { key: string; slots_limited: boolean }[];
    total_slots?: number | null;
    slots_limited?: boolean | null;
  };
};

export default class SignupCountData {
  data: GroupedSignupCount[];

  static fromRun(run: { grouped_signup_counts: GroupedSignupCount[] }): SignupCountData {
    return SignupCountData.fromGroupedCounts(run.grouped_signup_counts);
  }

  static fromGroupedCounts(groupedCounts: GroupedSignupCount[]): SignupCountData {
    return new SignupCountData(groupedCounts);
  }

  constructor(data: GroupedSignupCount[]) {
    this.data = data;
  }

  filterRows(filters: SignupCountDataFilter): GroupedSignupCount[] {
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
      bucket_key: limitedBuckets.map((bucket) => bucket.key),
      counted: true,
    });
  }

  getNotCountedConfirmedSignupCount(): number {
    return this.sumSignupCounts({ state: SignupState.Confirmed, counted: false });
  }

  getWaitlistCount(): number {
    return this.sumSignupCounts({ state: SignupState.Waitlisted });
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
