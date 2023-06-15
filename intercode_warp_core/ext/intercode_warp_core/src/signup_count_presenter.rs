use std::{borrow::Cow, collections::HashMap, hash::Hash};

use futures::try_join;
use magnus::{ExceptionClass, TryConvert};
use sqlx::{Executor, Postgres, Row};

use crate::registration_policy::RegistrationPolicy;

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub enum SignupCountDataCountedStatus {
    Counted,
    NotCounted,
}

impl TryConvert for SignupCountDataCountedStatus {
    fn try_convert(val: magnus::Value) -> Result<Self, magnus::Error> {
        let val_string = val.try_convert::<String>()?.trim().to_lowercase();

        match val_string.as_str() {
            "counted" => Ok(Self::Counted),
            "not_counted" => Ok(Self::NotCounted),
            _ => Err(magnus::Error::Error(
                ExceptionClass::default(),
                format!("Unknown counted status value: {}", val_string).into(),
            )),
        }
    }
}

impl From<bool> for SignupCountDataCountedStatus {
    fn from(counted: bool) -> Self {
        match counted {
            true => Self::Counted,
            false => Self::NotCounted,
        }
    }
}

fn effective_bucket_key<'a>(
    state: &'a str,
    bucket_key: Option<&'a str>,
    requested_bucket_key: Option<&'a str>,
) -> Option<&'a str> {
    match state {
        "waitlisted" => requested_bucket_key,
        _ => bucket_key,
    }
}

struct SignupCountDataRow {
    run_id: i64,
    state: String,
    bucket_key: Option<String>,
    requested_bucket_key: Option<String>,
    counted: Option<bool>,
    count: i64,
}

#[derive(Default, Clone, Debug)]
#[magnus::wrap(class = "IntercodeWarpCore::RunSignupCounts")]
pub struct RunSignupCounts {
    pub registration_policy: RegistrationPolicy,
    pub count_by_state_and_bucket_key_and_counted:
        HashMap<String, HashMap<String, HashMap<SignupCountDataCountedStatus, i64>>>,
}

impl RunSignupCounts {
    pub fn add(&mut self, state: &str, bucket_key: Option<&str>, counted: bool, count: i64) {
        let state_entry = self
            .count_by_state_and_bucket_key_and_counted
            .entry(state.to_string());
        let count_by_bucket_key = state_entry.or_insert_with(Default::default);
        let count_by_counted = count_by_bucket_key
            .entry(bucket_key.map(|key| key.to_string()).unwrap_or_default())
            .or_insert_with(Default::default);
        let current_count_entry = count_by_counted.entry(counted.into());
        current_count_entry
            .and_modify(|current_count| *current_count += count)
            .or_insert(count);
    }

    fn count_by_state_and_bucket_key_and_counted_internal(
        &self,
        state: &str,
        bucket_key: Option<&str>,
        counted: &SignupCountDataCountedStatus,
    ) -> i64 {
        let Some(count_by_bucket_key_and_counted) = self.count_by_state_and_bucket_key_and_counted.get(state) else {
      return 0;
    };

        let Some(count_by_counted) = count_by_bucket_key_and_counted.get(bucket_key.unwrap_or_default()) else {
      return 0;
    };

        count_by_counted.get(counted).copied().unwrap_or(0)
    }

    pub fn signup_count_by_state_and_bucket_key_and_counted(
        &self,
        state: String,
        bucket_key: Option<String>,
        counted: SignupCountDataCountedStatus,
    ) -> i64 {
        self.count_by_state_and_bucket_key_and_counted_internal(
            &state,
            bucket_key.as_deref(),
            &counted,
        )
    }

    pub fn counted_signups_by_state(&self, state: String) -> i64 {
        self.registration_policy
            .all_buckets()
            .fold(0, |acc, bucket| {
                acc + self.count_by_state_and_bucket_key_and_counted_internal(
                    &state,
                    Some(&bucket.key),
                    &SignupCountDataCountedStatus::Counted,
                )
            })
    }

    pub fn not_counted_signups_by_state(&self, state: String) -> i64 {
        self.registration_policy
            .all_buckets()
            .fold(0, |acc, bucket| {
                acc + self.count_by_state_and_bucket_key_and_counted_internal(
                    &state,
                    Some(&bucket.key),
                    &SignupCountDataCountedStatus::NotCounted,
                )
            })
    }

    pub fn counted_key_for_state(&self, state: &str) -> SignupCountDataCountedStatus {
        if state != "confirmed" || self.registration_policy.only_uncounted() {
            SignupCountDataCountedStatus::NotCounted
        } else {
            SignupCountDataCountedStatus::Counted
        }
    }

    pub fn bucket_description_for_state(&self, bucket_key: &str, state: &str) -> String {
        let Some(bucket) = self.registration_policy.bucket_with_key(bucket_key) else {
      return "".to_string();
    };

        let counted = if bucket.is_not_counted() {
            SignupCountDataCountedStatus::NotCounted
        } else {
            self.counted_key_for_state(state)
        };

        let count = self.count_by_state_and_bucket_key_and_counted_internal(
            state,
            Some(bucket_key),
            &counted,
        );
        if self.registration_policy.all_buckets().count() == 1 {
            count.to_string()
        } else {
            format!("{}: {}", bucket.name.trim(), count)
        }
    }

    pub fn all_bucket_descriptions_for_state(&self, state: &str) -> String {
        let buckets = self.registration_policy.all_buckets().collect::<Vec<_>>();
        let mut bucket_texts = Vec::<String>::with_capacity(buckets.len() + 1);

        for bucket in buckets {
            bucket_texts.push(self.bucket_description_for_state(&bucket.key, state));
        }

        let no_preference_waitlist_count = self.count_by_state_and_bucket_key_and_counted_internal(
            "waitlisted",
            None,
            &SignupCountDataCountedStatus::NotCounted,
        );
        if state == "waitlisted" && no_preference_waitlist_count > 0 {
            bucket_texts.push(format!("No preference: {}", no_preference_waitlist_count));
        }

        bucket_texts.join(", ")
    }
}

pub async fn load_signup_count_data_for_run_ids<I: Iterator<Item = i64>>(
    db: impl Executor<'_, Database = Postgres> + Clone,
    run_ids: I,
) -> Result<HashMap<i64, RunSignupCounts>, sqlx::Error> {
    let run_ids = run_ids.collect::<Vec<_>>();

    let (registration_policy_result, count_data) = try_join!(
        sqlx::query(
          "SELECT runs.id run_id, events.registration_policy registration_policy \
          FROM runs \
          INNER JOIN events ON events.id = runs.event_id \
          WHERE runs.id = ANY($1)"
        ).bind(run_ids.clone()).map(|row| {
            (
                row.get::<i64, &str>("run_id"),
                serde_json::from_value::<RegistrationPolicy>(row.get("registration_policy"))
                    .unwrap(),
            )
        }).fetch_all(db.clone()),
        sqlx::query(
          "SELECT run_id, state, bucket_key, requested_bucket_key, counted, count(*) signup_count \
          FROM signups \
          WHERE run_id = ANY($1) \
          GROUP BY run_id, state, bucket_key, requested_bucket_key, counted"
        ).bind(run_ids).map(|row| SignupCountDataRow {
            run_id: row.get("run_id"),
            state: row.get("state"),
            bucket_key: row.get("bucket_key"),
            requested_bucket_key: row.get("requested_bucket_key"),
            counted: row.get("counted"),
            count: row.get("signup_count"),
        }).fetch_all(db)
    )?;

    let registration_policy_by_run_id = registration_policy_result
        .into_iter()
        .collect::<HashMap<_, _>>();

    Ok(count_data.iter().fold(Default::default(), |mut acc, row| {
        let entry = acc.entry(row.run_id);
        let run_counts = entry.or_insert_with(|| RunSignupCounts {
            registration_policy: registration_policy_by_run_id
                .get(&row.run_id)
                .cloned()
                .unwrap_or_default(),
            count_by_state_and_bucket_key_and_counted: Default::default(),
        });

        let effective_bucket_key = effective_bucket_key(
            &row.state,
            row.bucket_key.as_deref(),
            row.requested_bucket_key.as_deref(),
        );
        run_counts.add(
            &row.state,
            effective_bucket_key,
            row.counted.unwrap_or(false),
            row.count,
        );

        acc
    }))
}
