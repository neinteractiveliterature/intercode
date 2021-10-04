import { gql } from '@apollo/client';
import { EventCategoryFields } from './queries';

export const CreateEventCategory = gql`
  mutation CreateEventCategory($eventCategory: EventCategoryInput!) {
    createEventCategory(input: { event_category: $eventCategory }) {
      event_category {
        id: transitionalId
        ...EventCategoryFields
      }
    }
  }

  ${EventCategoryFields}
`;

export const UpdateEventCategory = gql`
  mutation UpdateEventCategory($id: Int!, $eventCategory: EventCategoryInput!) {
    updateEventCategory(input: { id: $id, event_category: $eventCategory }) {
      event_category {
        id: transitionalId
        ...EventCategoryFields
      }
    }
  }

  ${EventCategoryFields}
`;

export const DeleteEventCategory = gql`
  mutation DeleteEventCategory($id: Int!) {
    deleteEventCategory(input: { id: $id }) {
      clientMutationId
    }
  }
`;
