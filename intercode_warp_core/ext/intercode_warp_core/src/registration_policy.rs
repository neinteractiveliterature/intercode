use indexmap::IndexMap;
use once_cell::sync::Lazy;
use paste::paste;
use regex::Regex;
use serde::{de::Visitor, ser::SerializeSeq, Deserialize, Deserializer, Serialize, Serializer};
use std::{
    fmt::{self, Debug, Display},
    iter::Sum,
    ops::Add,
};

static DISALLOWED_KEY_CHARS: Lazy<Regex> = Lazy::new(|| Regex::new("[^0-9a-z]").unwrap());

fn normalize_key(key: &str) -> String {
    DISALLOWED_KEY_CHARS
        .replace_all(&key.to_lowercase(), "_")
        .into_owned()
}

#[derive(Debug, Clone)]
pub enum RegistrationPolicyError {
    InconsistentBucketState,
}

#[derive(Debug, Clone, Copy, Default, PartialEq, Eq)]
pub enum SlotCount {
    #[default]
    Unlimited,
    Limited(usize),
}

impl SlotCount {
    pub fn is_unlimited(&self) -> bool {
        match self {
            SlotCount::Unlimited => true,
            SlotCount::Limited(_) => false,
        }
    }
}

impl Add for SlotCount {
    type Output = SlotCount;

    fn add(self, rhs: Self) -> Self::Output {
        match self {
            SlotCount::Unlimited => SlotCount::Unlimited,
            SlotCount::Limited(count) => match rhs {
                SlotCount::Unlimited => SlotCount::Unlimited,
                SlotCount::Limited(rhs_count) => SlotCount::Limited(count + rhs_count),
            },
        }
    }
}

impl PartialOrd for SlotCount {
    fn partial_cmp(&self, other: &Self) -> Option<std::cmp::Ordering> {
        match self {
            SlotCount::Unlimited => {
                if other.is_unlimited() {
                    Some(std::cmp::Ordering::Equal)
                } else {
                    Some(std::cmp::Ordering::Greater)
                }
            }
            SlotCount::Limited(count) => match other {
                SlotCount::Unlimited => Some(std::cmp::Ordering::Less),
                SlotCount::Limited(other_count) => count.partial_cmp(other_count),
            },
        }
    }
}

impl Ord for SlotCount {
    fn cmp(&self, other: &Self) -> std::cmp::Ordering {
        self.partial_cmp(other).unwrap()
    }
}

impl Display for SlotCount {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            SlotCount::Unlimited => f.write_fmt(format_args!("unlimited")),
            SlotCount::Limited(count) => f.write_fmt(format_args!("{}", count)),
        }
    }
}

impl Sum for SlotCount {
    fn sum<I: Iterator<Item = Self>>(iter: I) -> Self {
        iter.fold(SlotCount::Limited(0), |count, item| count + item)
    }
}

impl Serialize for SlotCount {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        match self {
            SlotCount::Unlimited => serializer.serialize_none(),
            SlotCount::Limited(count) => serializer.serialize_u64(*count as u64),
        }
    }
}

impl<'de> Deserialize<'de> for SlotCount {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        Ok(u64::deserialize(deserializer)
            .map(|count| SlotCount::Limited(count as usize))
            .unwrap_or(SlotCount::Unlimited))
    }
}

impl From<SlotCount> for Option<u32> {
    fn from(slot_count: SlotCount) -> Self {
        match slot_count {
            SlotCount::Unlimited => None,
            SlotCount::Limited(count) => Some(count as u32),
        }
    }
}

impl<N: Into<usize>> From<N> for SlotCount {
    fn from(value: N) -> Self {
        SlotCount::Limited(value.into())
    }
}

#[derive(Serialize, Deserialize, Default, Debug, Clone)]
pub struct RegistrationPolicyBucket {
    pub key: String,
    pub name: String,
    pub description: String,
    pub minimum_slots: SlotCount,
    pub preferred_slots: SlotCount,
    pub total_slots: SlotCount,
    slots_limited: Option<bool>,
    pub anything: Option<bool>,
    not_counted: Option<bool>,
    pub expose_attendees: Option<bool>,
}

impl RegistrationPolicyBucket {
    pub fn new(key: &str, name: &str, description: &str) -> RegistrationPolicyBucket {
        RegistrationPolicyBucket {
            key: normalize_key(key),
            name: name.to_owned(),
            description: description.to_owned(),
            ..Default::default()
        }
    }

    // pub fn available_slots(
    //     &self,
    //     signups: &[&signups::Model],
    // ) -> Result<SlotCount, RegistrationPolicyError> {
    //     if self.slots_unlimited() {
    //         return Ok(SlotCount::Unlimited);
    //     }

    //     if let SlotCount::Limited(total_slots) = self.total_slots {
    //         let signup_count = signups
    //             .iter()
    //             .filter(|signup| {
    //                 signup.state == "confirmed"
    //                     && matches!(&signup.bucket_key, Some(key) if key == &self.key)
    //                     && (self.is_not_counted() || matches!(signup.counted, Some(true)))
    //             })
    //             .count();

    //         Ok(SlotCount::Limited(total_slots - signup_count))
    //     } else {
    //         Err(RegistrationPolicyError::InconsistentBucketState)
    //     }
    // }

    // pub fn has_available_slots(
    //     &self,
    //     signups: &[&signups::Model],
    // ) -> Result<bool, RegistrationPolicyError> {
    //     let available_slots = self.available_slots(signups)?;

    //     match available_slots {
    //         SlotCount::Unlimited => Ok(true),
    //         SlotCount::Limited(count) => Ok(count > 0),
    //     }
    // }

    pub fn is_anything(&self) -> bool {
        self.anything.unwrap_or(false)
    }

    // pub fn is_full(&self, signups: &[&signups::Model]) -> Result<bool, RegistrationPolicyError> {
    //     self.has_available_slots(signups)
    //         .map(|has_slots| !has_slots)
    // }

    pub fn is_not_counted(&self) -> bool {
        self.not_counted.unwrap_or(false)
    }

    pub fn is_counted(&self) -> bool {
        !self.is_not_counted()
    }

    pub fn slots_limited(&self) -> bool {
        self.slots_limited.unwrap_or(false)
    }

    pub fn slots_unlimited(&self) -> bool {
        !self.slots_limited()
    }
}

fn serialize_buckets<S>(
    buckets: &IndexMap<String, RegistrationPolicyBucket>,
    serializer: S,
) -> Result<S::Ok, S::Error>
where
    S: Serializer,
{
    let mut seq = serializer.serialize_seq(Some(buckets.len()))?;
    for bucket in buckets.values() {
        seq.serialize_element(bucket)?;
    }
    seq.end()
}

fn deserialize_buckets<'de, D>(
    deserializer: D,
) -> Result<IndexMap<String, RegistrationPolicyBucket>, D::Error>
where
    D: Deserializer<'de>,
{
    #[derive(Deserialize)]
    #[serde(field_identifier, rename_all = "lowercase")]
    enum Field {
        Buckets,
    }

    struct BucketsVisitor;

    impl<'de> Visitor<'de> for BucketsVisitor {
        type Value = IndexMap<String, RegistrationPolicyBucket>;

        fn expecting(&self, formatter: &mut fmt::Formatter) -> fmt::Result {
            formatter.write_str("sequence of Buckets")
        }

        fn visit_seq<A>(self, mut seq: A) -> Result<Self::Value, A::Error>
        where
            A: serde::de::SeqAccess<'de>,
        {
            let mut buckets: IndexMap<String, RegistrationPolicyBucket> = Default::default();
            while let Some(element) = seq.next_element::<RegistrationPolicyBucket>()? {
                buckets.insert(element.key.clone(), element);
            }

            Ok(buckets)
        }
    }

    const FIELDS: &[&str] = &["buckets"];
    deserializer.deserialize_struct("RegistrationPolicy", FIELDS, BucketsVisitor)
}

#[derive(Serialize, Deserialize, Default, Debug, Clone)]
pub struct RegistrationPolicy {
    #[serde(
        serialize_with = "serialize_buckets",
        deserialize_with = "deserialize_buckets"
    )]
    buckets: IndexMap<String, RegistrationPolicyBucket>,
    prevent_no_preference_signups: Option<bool>,
}

macro_rules! slot_count_methods {
    ($method_name: ident) => {
        pub fn $method_name(&self) -> SlotCount {
            self.counted_buckets()
                .map(|bucket| &bucket.$method_name)
                .cloned()
                .sum()
        }

        paste! {
          pub fn [<$method_name _including_not_counted>](&self) -> SlotCount {
            self
              .all_buckets()
              .map(|bucket| &bucket.$method_name)
              .cloned()
              .sum()
          }
        }
    };
}

impl RegistrationPolicy {
    pub fn unlimited() -> Self {
        RegistrationPolicy {
            buckets: vec![(
                "unlimited".to_string(),
                RegistrationPolicyBucket {
                    key: "unlimited".to_string(),
                    name: "Signups".to_string(),
                    description: "Signups for this event".to_string(),
                    slots_limited: Some(false),
                    anything: Some(false),
                    expose_attendees: Some(false),
                    not_counted: Some(false),
                    minimum_slots: SlotCount::Unlimited,
                    preferred_slots: SlotCount::Unlimited,
                    total_slots: SlotCount::Unlimited,
                },
            )]
            .into_iter()
            .collect(),
            prevent_no_preference_signups: None,
        }
    }
    pub fn bucket_with_key(&self, key: &str) -> Option<&RegistrationPolicyBucket> {
        self.buckets.get(key)
    }

    pub fn all_buckets(&self) -> impl Iterator<Item = &RegistrationPolicyBucket> {
        self.buckets.values()
    }

    pub fn counted_buckets(&self) -> impl Iterator<Item = &RegistrationPolicyBucket> {
        self.all_buckets().filter(|bucket| bucket.is_counted())
    }

    pub fn not_counted_buckets(&self) -> impl Iterator<Item = &RegistrationPolicyBucket> {
        self.all_buckets().filter(|bucket| bucket.is_not_counted())
    }

    slot_count_methods!(total_slots);
    slot_count_methods!(minimum_slots);
    slot_count_methods!(preferred_slots);

    pub fn only_uncounted(&self) -> bool {
        self.counted_buckets().count() == 0
    }

    pub fn accepts_signups(&self) -> bool {
        match self.total_slots_including_not_counted() {
            SlotCount::Unlimited => true,
            SlotCount::Limited(count) => count > 0,
        }
    }

    pub fn slots_unlimited(&self) -> bool {
        let only_uncounted = self.only_uncounted();
        self.all_buckets()
            .any(|bucket| bucket.slots_unlimited() && (bucket.is_counted() || only_uncounted))
    }

    pub fn slots_limited(&self) -> bool {
        !self.slots_unlimited()
    }

    pub fn prevent_no_preference_signups(&self) -> bool {
        matches!(self.prevent_no_preference_signups, Some(prevent) if prevent)
    }

    pub fn allow_no_preference_signups(&self) -> bool {
        !self.prevent_no_preference_signups()
    }
}
