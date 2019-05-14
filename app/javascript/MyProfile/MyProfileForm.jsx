import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import isEqual from 'lodash-es/isEqual';

import buildFormStateFromData from '../UserConProfiles/buildFormStateFromData';
import FormPresenterApp from '../FormPresenter';
import FormPresenter from '../FormPresenter/Layouts/FormPresenter';
import { MyProfileQuery } from './queries.gql';
import { UpdateUserConProfile } from '../UserConProfiles/mutations.gql';
import useQuerySuspended from '../useQuerySuspended';
import ErrorDisplay from '../ErrorDisplay';
import useAsyncFunction from '../useAsyncFunction';
import useMutationCallback from '../useMutationCallback';
import useAutocommitFormResponseOnChange from '../FormPresenter/useAutocommitFormResponseOnChange';
import useFormResponse from '../FormPresenter/useFormResponse';

function parseResponseErrors(error) {
  const { graphQLErrors } = error;
  const updateError = graphQLErrors.find(graphQLError => isEqual(graphQLError.path, ['updateUserConProfile']));
  const { validationErrors } = (updateError || {});
  return validationErrors;
}

function MyProfileForm() {
  const { data, error } = useQuerySuspended(MyProfileQuery);
  const [mutate, , mutationInProgress] = useAsyncFunction(
    useMutationCallback(UpdateUserConProfile),
  );
  const [responseErrors, setResponseErrors] = useState({});

  const {
    userConProfile: initialUserConProfile, convention, form,
  } = buildFormStateFromData(data.myProfile, data.convention);

  const [userConProfile, setUserConProfile] = useState(initialUserConProfile);
  const [response, responseValuesChanged] = useFormResponse(userConProfile, setUserConProfile);

  const updateUserConProfile = useCallback(
    async (profile) => {
      try {
        await mutate({
          variables: {
            input: {
              id: profile.id,
              user_con_profile: {
                form_response_attrs_json: JSON.stringify(profile.form_response_attrs),
              },
            },
          },
        });
      } catch (e) {
        setResponseErrors(parseResponseErrors(e));
      }
    },
    [mutate],
  );

  useAutocommitFormResponseOnChange(updateUserConProfile, userConProfile);

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const formPresenterProps = {
    form,
    convention,
    response,
    responseErrors,
    error,
    isSubmittingResponse: false,
    isUpdatingResponse: mutationInProgress,
    responseValuesChanged,
    submitForm: () => {},
  };

  return (
    <>
      <FormPresenterApp form={form}>
        <FormPresenter {...formPresenterProps} />
      </FormPresenterApp>

      <div className="my-4">
        <Link to="/my_profile" className="btn btn-primary">
          Finish and return to my profile
        </Link>
      </div>
    </>
  );
}

export default MyProfileForm;
