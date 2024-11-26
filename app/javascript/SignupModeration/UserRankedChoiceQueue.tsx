import { LoaderFunction, useLoaderData } from 'react-router';
import UserSignupQueue from '../EventsApp/MySignupQueue/UserSignupQueue';
import UserConProfileSignupsCard from '../EventsApp/SignupAdmin/UserConProfileSignupsCard';
import {
  SignupModerationAttendeeRankedChoicesQueryData,
  SignupModerationAttendeeRankedChoicesQueryDocument,
  SignupModerationAttendeeRankedChoicesQueryVariables,
} from './queries.generated';
import { client } from '../useIntercodeApolloClient';

export const loader: LoaderFunction = async ({ params: { userConProfileId } }) => {
  const { data } = await client.query<
    SignupModerationAttendeeRankedChoicesQueryData,
    SignupModerationAttendeeRankedChoicesQueryVariables
  >({
    query: SignupModerationAttendeeRankedChoicesQueryDocument,
    variables: { userConProfileId: userConProfileId ?? '' },
  });
  return data;
};

function UserRankedChoiceQueue() {
  const data = useLoaderData() as SignupModerationAttendeeRankedChoicesQueryData;

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
