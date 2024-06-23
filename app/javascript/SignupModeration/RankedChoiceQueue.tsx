import { FormGroupWithLabel } from '@neinteractiveliterature/litform';
import UserConProfileSelect from '../BuiltInFormControls/UserConProfileSelect';
import { DefaultUserConProfilesQueryData } from '../BuiltInFormControls/selectDefaultQueries.generated';
import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router';
import {
  SignupModerationAttendeeRankedChoicesQueryDocument,
  useSignupModerationAttendeeRankedChoicesQuery,
} from './queries.generated';
import { LoadQueryFromParamsWrapper } from '../GraphqlLoadingWrappers';
import UserSignupQueue from '../EventsApp/MySignupQueue/UserSignupQueue';
import UserConProfileSignupsCard from '../EventsApp/SignupAdmin/UserConProfileSignupsCard';

const UserRankedChoiceQueue = LoadQueryFromParamsWrapper(
  useSignupModerationAttendeeRankedChoicesQuery,
  ({ userConProfileId }: { userConProfileId: string }) => ({ userConProfileId }),
  ({ data }) => {
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
  },
);

type UserConProfileType = NonNullable<
  DefaultUserConProfilesQueryData['convention']
>['user_con_profiles_paginated']['entries'][0];

function RankedChoiceQueue() {
  const [userConProfile, setUserConProfile] = useState<UserConProfileType>();
  const navigate = useNavigate();

  useEffect(() => {
    if (userConProfile != null) {
      navigate(`${userConProfile.id}`, { replace: true, relative: 'route' });
    }
  }, [userConProfile, navigate]);

  return (
    <>
      <FormGroupWithLabel label="Attendee">
        {(id) => (
          <UserConProfileSelect
            id={id}
            value={userConProfile}
            onChange={(newUserConProfile: UserConProfileType) => setUserConProfile(newUserConProfile)}
          />
        )}
      </FormGroupWithLabel>

      <Routes>
        <Route path=":userConProfileId" element={<UserRankedChoiceQueue />} />
      </Routes>
    </>
  );
}

export default RankedChoiceQueue;
