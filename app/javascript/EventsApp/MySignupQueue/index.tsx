import { Trans, useTranslation } from 'react-i18next';
import { LoadQueryWrapper } from '@neinteractiveliterature/litform';
import { MySignupQueueQueryDocument, useMySignupQueueQuery } from './queries.generated';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import RankedChoiceUserSettings from './RankedChoiceUserSettings';
import UserConProfileSignupsCard from '../SignupAdmin/UserConProfileSignupsCard';
import AppRootContext from '../../AppRootContext';
import NextRoundInfoBox from './NextRoundInfoBox';
import UserSignupQueue from './UserSignupQueue';
import { usePendingChoices } from './usePendingChoices';

const MySignupQueue = LoadQueryWrapper(useMySignupQueueQuery, ({ data }) => {
  const { t } = useTranslation();
  const { myProfile } = useContext(AppRootContext);
  const pendingChoices = usePendingChoices(data.convention.my_profile);

  return (
    <>
      <h1>{t('signups.mySignupQueue.title', 'My signup queue')}</h1>

      <div className="row mb-4">
        <div className="col-12 col-md-8">
          <NextRoundInfoBox />

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

      <RankedChoiceUserSettings />
    </>
  );
});

export default MySignupQueue;
