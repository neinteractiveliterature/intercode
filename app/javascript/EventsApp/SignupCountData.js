import flatMap from 'lodash/flatMap';
import sum from 'lodash/sum';

export default class SignupCountData {
  static fromRun(run) {
    return SignupCountData.fromJSON(run.signup_count_by_state_and_bucket_key_and_counted);
  }

  static fromJSON(json) {
    const rawData = JSON.parse(json);
    const rows = flatMap(Object.entries(rawData), ([state, signupCountsByBucketKeyAndCounted]) => (
      flatMap(
        Object.entries(signupCountsByBucketKeyAndCounted),
        ([bucketKey, signupCountsByCounted]) => (
          flatMap(Object.entries(signupCountsByCounted), ([countedKey, signupCount]) => ({
            state,
            bucket_key: bucketKey,
            counted: countedKey === 'counted',
            signup_count: signupCount,
          }))
        ),
      )
    ));

    return new SignupCountData(rows);
  }

  constructor(data) {
    this.data = data;
  }

  filterRows(filters) {
    return Object.entries(filters).reduce((filteredData, [field, value]) => {
      if (Array.isArray(value)) {
        return filteredData.filter((row) => value.includes(row[field]));
      }

      return filteredData.filter((row) => value === row[field]);
    }, this.data);
  }

  sumSignupCounts(filters) {
    return sum(this.filterRows(filters).map((row) => row.signup_count));
  }

  getConfirmedLimitedSignupCount(event) {
    const limitedBuckets = event.registration_policy.buckets.filter((bucket) => bucket.slots_limited);
    return this.sumSignupCounts({
      state: 'confirmed',
      bucket_key: limitedBuckets.map((bucket) => bucket.key),
      counted: true,
    });
  }

  getNotCountedConfirmedSignupCount() {
    return this.sumSignupCounts({ state: 'confirmed', counted: false });
  }

  getWaitlistCount() {
    return this.sumSignupCounts({ state: 'waitlisted' });
  }

  runFull(event) {
    const { total_slots: totalSlots, slots_limited: slotsLimited } = event.registration_policy;
    return (
      slotsLimited
      && totalSlots > 0
      && (
        this.getConfirmedLimitedSignupCount(event) === totalSlots
      )
    );
  }
}
