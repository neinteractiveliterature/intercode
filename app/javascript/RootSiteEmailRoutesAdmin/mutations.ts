import { gql } from '@apollo/client';
import { EmailRouteFields } from './queries';

export const CreateEmailRoute = gql`
  mutation CreateEmailRoute($emailRoute: EmailRouteInput!) {
    createEmailRoute(input: { email_route: $emailRoute }) {
      email_route {
        id
        ...EmailRouteFields
      }
    }
  }

  ${EmailRouteFields}
`;

export const UpdateEmailRoute = gql`
  mutation UpdateEmailRoute($id: ID!, $emailRoute: EmailRouteInput!) {
    updateEmailRoute(input: { transitionalId: $id, email_route: $emailRoute }) {
      email_route {
        id
        ...EmailRouteFields
      }
    }
  }

  ${EmailRouteFields}
`;

export const DeleteEmailRoute = gql`
  mutation DeleteEmailRoute($id: ID!) {
    deleteEmailRoute(input: { transitionalId: $id }) {
      clientMutationId
    }
  }
`;
