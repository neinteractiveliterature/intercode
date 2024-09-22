import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useModal } from '@neinteractiveliterature/litform';

import CreateEventProposalModal from './CreateEventProposalModal';
import SignInButton from '../Authentication/SignInButton';
import { ProposeEventButtonQueryDocument } from './queries.generated';
import { useSuspenseQuery } from '@apollo/client';

export type ProposeEventButtonProps = {
  className?: string;
  caption: React.ReactNode;
};

export default function ProposeEventButton({ className, caption }: ProposeEventButtonProps) {
  const { data } = useSuspenseQuery(ProposeEventButtonQueryDocument);
  const { t } = useTranslation();
  const buttonId = React.useId();
  const modal = useModal();

  if (!data.convention.my_profile) {
    return (
      <SignInButton
        afterSignInPath={window.location.href}
        className={className}
        caption={t('buttons.proposeEventLoggedOut')}
      />
    );
  }

  return (
    <div>
      <button id={buttonId} className={className} type="button" onClick={modal.open}>
        {caption}
      </button>

      <CreateEventProposalModal
        cancel={modal.close}
        visible={modal.visible}
        userEventProposals={data.convention.my_profile.user?.event_proposals ?? []}
        proposableEventCategories={data.convention.event_categories.filter((category) => category.proposable)}
        departments={data.convention.departments}
      />
    </div>
  );
}
