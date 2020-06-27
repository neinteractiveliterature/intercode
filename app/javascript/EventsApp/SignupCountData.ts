import flatMap from 'lodash/flatMap';
import sum from 'lodash/sum';
import { SignupState } from '../graphqlQueries';

type SignupCountDataRow = {
  state: SignupState,
  bucket_key: string,
  counted: boolean,
  signup_count: number,
};

export type SignupCountDataFilter = {
  state?: SignupState | SignupState[],
  bucket_key?: string | string[],
  counted?: boolean | boolean[],
};

type SignupCountsByStateAndBucketKeyAndCounted = {
  [S in SignupState]: {
    [bucketKey: string]: {
      counted?: number,
      not_counted?: number,
    },
  }
};

export type EventForSignupCountData = {
  registration_policy?: null | {
    buckets: { key: string, slots_limited: boolean }[],
    total_slots?: number | null,
    slots_limited?: boolean | null,
  },
};

export default class SignupCountData {
  data: SignupCountDataRow[];

  static fromRun(run: { signup_count_by_state_and_bucket_key_and_counted: string }) {
    return SignupCountData.fromJSON(run.signup_count_by_state_and_bucket_key_and_counted);
  }

  static fromJSON(json: string) {
    const rawData: SignupCountsByStateAndBucketKeyAndCounted = JSON.parse(json);
    const rows: SignupCountDataRow[] = flatMap(
      Object.entries(rawData), ([state, signupCountsByBucketKeyAndCounted]) => (
        flatMap(
          Object.entries(signupCountsByBucketKeyAndCounted),
          ([bucketKey, signupCountsByCounted]) => (
            flatMap(Object.entries(signupCountsByCounted), ([countedKey, signupCount]) => ({
              state: state as SignupState,
              bucket_key: bucketKey,
              counted: countedKey === 'counted',
              signup_count: signupCount ?? 0,
            }))
          ),
        )
      ),
    );

    return new SignupCountData(rows);
  }

  constructor(data: SignupCountDataRow[]) {
    this.data = data;
  }

  filterRows(filters: SignupCountDataFilter) {
    return Object.entries(filters).reduce((filteredData, [field, value]) => {
      if (Array.isArray(value)) {
        return filteredData.filter((row) => (value as any[]).includes(row[field]));
      }

      return filteredData.filter((row) => value === row[field]);
    }, this.data);
  }

  sumSignupCounts(filters: SignupCountDataFilter) {
    return sum(this.filterRows(filters).map((row) => row.signup_count));
  }

  getConfirmedLimitedSignupCount(event: EventForSignupCountData) {
    if (!event.registration_policy) {
      return 0;
    }

    const limitedBuckets = event.registration_policy.buckets
      .filter((bucket) => bucket.slots_limited);
    return this.sumSignupCounts({
      state: SignupState.Confirmed,
      bucket_key: limitedBuckets.map((bucket) => bucket.key),
      counted: true,
    });
  }

  getNotCountedConfirmedSignupCount() {
    return this.sumSignupCounts({ state: SignupState.Confirmed, counted: false });
  }

  getWaitlistCount() {
    return this.sumSignupCounts({ state: SignupState.Waitlisted });
  }

  runFull(event: EventForSignupCountData): boolean {
    if (!event.registration_policy) {
      return false;
    }

    const { total_slots: totalSlots, slots_limited: slotsLimited } = event.registration_policy;
    return !!(
      slotsLimited
      && totalSlots
      && totalSlots > 0
      && (
        this.getConfirmedLimitedSignupCount(event) === totalSlots
      )
    );
  }
}
