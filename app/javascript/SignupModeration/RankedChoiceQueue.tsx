import { FormGroupWithLabel } from '@neinteractiveliterature/litform';
import UserConProfileSelect from '../BuiltInFormControls/UserConProfileSelect';
import { DefaultUserConProfilesQueryData } from '../BuiltInFormControls/selectDefaultQueries.generated';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';

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

      <Outlet />
    </>
  );
}

export const Component = RankedChoiceQueue;
