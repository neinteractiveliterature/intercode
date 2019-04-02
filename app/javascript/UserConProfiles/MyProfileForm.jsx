import React, { useState, useCallback } from 'react';
import { isEqual } from 'lodash';

import buildFormStateFromData from './buildFormStateFromData';
import FormPresenterApp from '../FormPresenter';
import FormPresenter from '../FormPresenter/Layouts/FormPresenter';
import { MyProfileQuery } from './queries.gql';
import { UpdateUserConProfile } from './mutations.gql';
import useQuerySuspended from '../useQuerySuspended';
import ErrorDisplay from '../ErrorDisplay';
import useAsyncFunction from '../useAsyncFunction';
import useMutationCallback from '../useMutationCallback';
import useAutocommitFormResponseOnChange from '../FormPresenter/useAutocommitFormResponseOnChange';

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

  const responseValuesChanged = useCallback(
    (newResponseValues) => {
      setUserConProfile(previousProfile => ({
        ...previousProfile,
        form_response_attrs: {
          ...previousProfile.form_response_attrs,
          ...newResponseValues,
        },
      }));
    },
    [],
  );

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
    response: userConProfile.form_response_attrs,
    responseErrors,
    error,
    isSubmittingResponse: false,
    isUpdatingResponse: mutationInProgress,
    responseValuesChanged,
    currentSectionChanged: () => {},
    submitForm: () => {},
  };

  return (
    <FormPresenterApp form={form}>
      <FormPresenter {...formPresenterProps} />
    </FormPresenterApp>
  );
}

export default MyProfileForm;
