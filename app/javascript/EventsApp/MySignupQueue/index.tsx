import { Trans, useTranslation } from 'react-i18next';
import { MySignupQueueQueryDocument } from './queries.generated';
import { useContext } from 'react';
import { Link } from 'react-router';
import RankedChoiceUserSettings from './RankedChoiceUserSettings';
import UserConProfileSignupsCard from '../SignupAdmin/UserConProfileSignupsCard';
import AppRootContext from '../../AppRootContext';
import NextRoundInfoBox from './NextRoundInfoBox';
import UserSignupQueue from './UserSignupQueue';
import { usePendingChoices } from './usePendingChoices';
import useLoginRequired from 'Authentication/useLoginRequired';
import BlockPartial from 'UIComponents/BlockPartial';
import { CmsPartialBlockName } from 'graphqlTypes.generated';
import { Route } from './+types/index';

export const loader = async ({ context }: Route.LoaderArgs) => {
  const { data } = await context.client.query({ query: MySignupQueueQueryDocument });
  return data;
};

function MySignupQueue({ loaderData: data }: Route.ComponentProps) {
  const { t } = useTranslation();
  const { myProfile } = useContext(AppRootContext);
  const pendingChoices = usePendingChoices(data.convention.my_profile);
  const replacementContent = useLoginRequired();

  if (replacementContent) {
    return replacementContent;
  }

  return (
    <>
      <h1>{t('signups.mySignupQueue.title')}</h1>
      <BlockPartial
        name={CmsPartialBlockName.MySignupQueueText}
        blockPartial={data.convention.blockPartial}
        currentAbilityCanCreate={data.currentAbility.can_create_cms_partials}
      />
      <div className="row mb-4">
        <div className="col-12 col-md-8">
          <NextRoundInfoBox data={data} />

          {pendingChoices.length > 0 ? (
            <>
              {data.convention.my_profile && (
                <UserSignupQueue
                  userConProfile={data.convention.my_profile}
                  refetchQueries={[{ query: MySignupQueueQueryDocument }]}
                  readOnly={false}
                />
              )}

              <p className="mt-3">
                <Trans i18nKey="signups.mySignupQueue.addAdditional">
                  To add more events to your queue, go to <Link to="/events">the event catalog</Link> or{' '}
                  <Link to="/events/schedule">the event schedule</Link>. You can add events to your queue from each
                  event’s page.
                </Trans>
              </p>
            </>
          ) : (
            <div className="card bg-light">
              <div className="card-body">
                <div className="d-flex align-items-center gap-3">
                  <div>
                    <i className="bi-lightbulb h1" />
                  </div>
                  <div className="flex-grow-1">
                    <Trans i18nKey="signups.mySignupQueue.emptyState">
                      You currently have no events in your signup queue. To add something to your queue, go to{' '}
                      <Link to="/events">the event catalog</Link> or{' '}
                      <Link to="/events/schedule">the event schedule</Link>. You can add events to your queue from each
                      event’s page.
                    </Trans>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="col-12 col-md-4">
          {myProfile && <UserConProfileSignupsCard userConProfileId={myProfile.id} />}
        </div>
      </div>
      <RankedChoiceUserSettings data={data} />
    </>
  );
}

export default MySignupQueue;
