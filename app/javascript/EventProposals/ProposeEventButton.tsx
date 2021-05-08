import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import CreateEventProposalModal from './CreateEventProposalModal';
import SignInButton from '../Authentication/SignInButton';
import useUniqueId from '../useUniqueId';
import useModal from '../ModalDialogs/useModal';
import { LoadQueryWrapper } from '../GraphqlLoadingWrappers';
import { ProposeEventButtonQueryData, useProposeEventButtonQuery } from './queries.generated';

export type ProposeEventButtonProps = {
  className?: string;
  caption: React.ReactNode;
};

export default LoadQueryWrapper<ProposeEventButtonQueryData, ProposeEventButtonProps>(
  useProposeEventButtonQuery,
  function ProposeEventButton({ className, caption, data }) {
    const { t } = useTranslation();
    const history = useHistory();
    const buttonId = useUniqueId('propose-event-button-');
    const modal = useModal();

    const newProposalCreated = (eventProposal: { id: number }) => {
      history.push(`/event_proposals/${eventProposal.id}/edit`);
    };

    if (!data.myProfile) {
      return (
        <SignInButton
          afterSignInPath={window.location.href}
          className={className}
          caption={t('buttons.proposeEventLoggedOut', 'Log in to propose an event')}
        />
      );
    }

    return (
      <div>
        <button id={buttonId} className={className} type="button" onClick={modal.open}>
          {caption}
        </button>

        <CreateEventProposalModal
          onCreate={newProposalCreated}
          cancel={modal.close}
          visible={modal.visible}
          userEventProposals={data.myProfile.user?.event_proposals ?? []}
          proposableEventCategories={data.convention.event_categories.filter(
            (category) => category.proposable,
          )}
          departments={data.convention.departments}
        />
      </div>
    );
  },
);
