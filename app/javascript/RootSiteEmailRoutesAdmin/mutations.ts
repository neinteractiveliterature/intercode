import { gql } from '@apollo/client';
import { EmailRouteFields } from './queries';

export const CreateEmailRoute = gql`
  mutation CreateEmailRoute($emailRoute: EmailRouteInput!) {
    createEmailRoute(input: { email_route: $emailRoute }) {
      email_route {
        id: transitionalId
        ...EmailRouteFields
      }
    }
  }

  ${EmailRouteFields}
`;

export const UpdateEmailRoute = gql`
  mutation UpdateEmailRoute($id: Int!, $emailRoute: EmailRouteInput!) {
    updateEmailRoute(input: { id: $id, email_route: $emailRoute }) {
      email_route {
        id: transitionalId
        ...EmailRouteFields
      }
    }
  }

  ${EmailRouteFields}
`;

export const DeleteEmailRoute = gql`
  mutation DeleteEmailRoute($id: Int!) {
    deleteEmailRoute(input: { id: $id }) {
      clientMutationId
    }
  }
`;
