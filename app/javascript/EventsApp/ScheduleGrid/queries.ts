import { gql } from '@apollo/client';
import { RunBasicSignupData, CommonConventionData } from '../queries';

export const ScheduleGridEventFragment = gql`
  fragment ScheduleGridEventFragment on Event {
    id
    title
    length_seconds
    short_blurb_html
    my_rating
    can_play_concurrently

    event_category {
      id
      name
      default_color
      signed_up_color
      full_color
    }

    registration_policy {
      slots_limited
      only_uncounted
      total_slots
      total_slots_including_not_counted
      preferred_slots
      preferred_slots_including_not_counted
      minimum_slots
      minimum_slots_including_not_counted

      buckets {
        key
        not_counted
        total_slots
        slots_limited
      }
    }

    runs(start: $start, finish: $finish) {
      id
      starts_at
      schedule_note
      title_suffix

      ...RunBasicSignupData
      confirmed_signup_count
      not_counted_signup_count

      room_names
    }
  }

  ${RunBasicSignupData}
`;

export const ScheduleGridConventionDataQuery = gql`
  query ScheduleGridConventionDataQuery {
    convention: conventionByRequestHost {
      id
      pre_schedule_content_html
      ...CommonConventionData
    }
  }

  ${CommonConventionData}
`;

export const ScheduleGridEventsQuery = gql`
  query ScheduleGridEventsQuery($start: Date, $finish: Date) {
    convention: conventionByRequestHost {
      id
      events(start: $start, finish: $finish) {
        id
        ...ScheduleGridEventFragment
      }
    }
  }

  ${ScheduleGridEventFragment}
`;

export const ScheduleGridCombinedQuery = gql`
  query ScheduleGridCombinedQuery($start: Date, $finish: Date) {
    convention: conventionByRequestHost {
      id
      pre_schedule_content_html
      ...CommonConventionData

      events(start: $start, finish: $finish) {
        id
        ...ScheduleGridEventFragment
      }
    }
  }

  ${CommonConventionData}
  ${ScheduleGridEventFragment}
`;
