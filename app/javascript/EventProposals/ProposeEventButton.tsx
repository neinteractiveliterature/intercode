import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useModal, useUniqueId, LoadQueryWrapper } from '@neinteractiveliterature/litform';

import CreateEventProposalModal from './CreateEventProposalModal';
import SignInButton from '../Authentication/SignInButton';
import {
  ProposeEventButtonQueryData,
  ProposeEventButtonQueryVariables,
  useProposeEventButtonQuery,
} from './queries.generated';

export type ProposeEventButtonProps = {
  className?: string;
  caption: React.ReactNode;
};

export default LoadQueryWrapper<ProposeEventButtonQueryData, ProposeEventButtonQueryVariables, ProposeEventButtonProps>(
  useProposeEventButtonQuery,
  function ProposeEventButton({ className, caption, data }) {
    const { t } = useTranslation();
    const history = useHistory();
    const buttonId = useUniqueId('propose-event-button-');
    const modal = useModal();

    const newProposalCreated = (eventProposal: { id: string }) => {
      history.push(`/event_proposals/${eventProposal.id}/edit`);
    };

    if (!data.convention.my_profile) {
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
          userEventProposals={data.convention.my_profile.user?.event_proposals ?? []}
          proposableEventCategories={data.convention.event_categories.filter((category) => category.proposable)}
          departments={data.convention.departments}
        />
      </div>
    );
  },
);
