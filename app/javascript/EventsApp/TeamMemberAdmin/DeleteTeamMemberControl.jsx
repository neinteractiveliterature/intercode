import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';

import { DeleteTeamMember } from './mutations.gql';
import { TeamMembersQuery } from './queries.gql';

function DeleteTeamMemberControl({ children, event, teamMember }) {
  return (
    <Mutation mutation={DeleteTeamMember}>
      {(mutate) => {
        const deleteTeamMember = () => mutate({
          variables: { input: { id: teamMember.id } },
          update: (store) => {
            const data = store.readQuery({
              query: TeamMembersQuery,
              variables: { eventId: event.id },
            });

            data.event.team_members = data.event.team_members
              .filter(tm => tm.id !== teamMember.id);

            store.writeQuery({
              query: TeamMembersQuery,
              variables: { eventId: event.id },
              data,
            });
          },
        });

        return children(deleteTeamMember);
      }}
    </Mutation>
  );
}

DeleteTeamMemberControl.propTypes = {
  children: PropTypes.func.isRequired,
  event: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
  teamMember: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
};

export default DeleteTeamMemberControl;
