import { gql } from '@apollo/client';
import { EventCategoryFields } from './queries';

export const CreateEventCategory = gql`
  mutation CreateEventCategory($eventCategory: EventCategoryInput!) {
    createEventCategory(input: { event_category: $eventCategory }) {
      event_category {
        id
        ...EventCategoryFields
      }
    }
  }

  ${EventCategoryFields}
`;

export const UpdateEventCategory = gql`
  mutation UpdateEventCategory($id: ID!, $eventCategory: EventCategoryInput!) {
    updateEventCategory(input: { id: $id, event_category: $eventCategory }) {
      event_category {
        id
        ...EventCategoryFields
      }
    }
  }

  ${EventCategoryFields}
`;

export const DeleteEventCategory = gql`
  mutation DeleteEventCategory($id: ID!) {
    deleteEventCategory(input: { id: $id }) {
      clientMutationId
    }
  }
`;
