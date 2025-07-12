import { UserConProfileRankedChoiceQueueFieldsFragment } from './queries.generated';
import { InternalRefetchQueriesInclude } from '@apollo/client';
import { usePendingChoices } from './usePendingChoices';
import UserSignupQueueItem from './UserSignupQueueItem';

export type UserSignupQueueProps = {
  userConProfile: UserConProfileRankedChoiceQueueFieldsFragment;
  refetchQueries: InternalRefetchQueriesInclude;
  readOnly: boolean;
};

function UserSignupQueue({ userConProfile, refetchQueries, readOnly }: UserSignupQueueProps) {
  const pendingChoices = usePendingChoices(userConProfile);

  return (
    <section className="card">
      <ul className="list-group list-group-flush">
        {pendingChoices.map((_, index) => (
          <UserSignupQueueItem
            key={index}
            index={index}
            readOnly={readOnly}
            refetchQueries={refetchQueries}
            userConProfile={userConProfile}
          />
        ))}
      </ul>
    </section>
  );
}

export default UserSignupQueue;
