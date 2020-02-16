import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';

import CreateEventProposalModal from './CreateEventProposalModal';
import { ProposeEventButtonQuery } from './queries.gql';
import SignInButton from '../Authentication/SignInButton';
import useUniqueId from '../useUniqueId';
import useModal from '../ModalDialogs/useModal';
import LoadingIndicator from '../LoadingIndicator';
import ErrorDisplay from '../ErrorDisplay';

function ProposeEventButton({ className, caption }) {
  const history = useHistory();
  const buttonId = useUniqueId('propose-event-button-');
  const modal = useModal();
  const { data, loading, error } = useQuery(ProposeEventButtonQuery);

  const newProposalCreated = (eventProposal) => {
    history.push(`/event_proposals/${eventProposal.id}/edit`);
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  if (!data.myProfile) {
    return (
      <SignInButton
        afterSignInPath={window.location.href}
        className={className}
        caption="Log in to propose an event"
      />
    );
  }

  return (
    <div>
      <button
        id={buttonId}
        className={className}
        type="button"
        onClick={modal.open}
      >
        {caption}
      </button>

      <CreateEventProposalModal
        onCreate={newProposalCreated}
        cancel={modal.close}
        visible={modal.visible}
        userEventProposals={data.myProfile.user.event_proposals}
        proposableEventCategories={data.convention.event_categories
          .filter((category) => category.proposable)}
        departments={data.convention.departments}
      />
    </div>
  );
}

ProposeEventButton.propTypes = {
  caption: PropTypes.node.isRequired,
  className: PropTypes.string,
};

ProposeEventButton.defaultProps = {
  className: 'btn btn-secondary',
};

export default ProposeEventButton;
