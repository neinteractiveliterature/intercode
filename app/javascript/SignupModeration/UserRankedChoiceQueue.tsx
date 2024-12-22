import UserSignupQueue from '../EventsApp/MySignupQueue/UserSignupQueue';
import UserConProfileSignupsCard from '../EventsApp/SignupAdmin/UserConProfileSignupsCard';
import { SignupModerationAttendeeRankedChoicesQueryDocument } from './queries.generated';
import { Route } from './+types/UserRankedChoiceQueue';

export async function loader({ params: { userConProfileId }, context }: Route.LoaderArgs) {
  const { data } = await context.client.query({
    query: SignupModerationAttendeeRankedChoicesQueryDocument,
    variables: { userConProfileId: userConProfileId ?? '' },
  });
  return data;
}

function UserRankedChoiceQueue({ loaderData: data }: Route.ComponentProps): JSX.Element {
  return (
    <>
      <h3>{data.convention.user_con_profile.name_without_nickname}</h3>

      <div className="row">
        <div className="col-12 col-md-8">
          <UserSignupQueue
            userConProfile={data.convention.user_con_profile}
            refetchQueries={[
              {
                query: SignupModerationAttendeeRankedChoicesQueryDocument,
                variables: { userConProfileId: data.convention.user_con_profile.id },
              },
            ]}
            readOnly={true}
          />
        </div>
        <div className="col-12 col-md-4">
          <UserConProfileSignupsCard userConProfileId={data.convention.user_con_profile.id} />
        </div>
      </div>
    </>
  );
}

export default UserRankedChoiceQueue;
