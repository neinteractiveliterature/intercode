import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import isEqual from 'lodash-es/isEqual';
import { useMutation } from 'react-apollo-hooks';

import buildFormStateFromData from '../UserConProfiles/buildFormStateFromData';
import SinglePageFormPresenter from '../FormPresenter/SinglePageFormPresenter';
import { MyProfileQuery } from './queries.gql';
import { UpdateUserConProfile } from '../UserConProfiles/mutations.gql';
import useQuerySuspended from '../useQuerySuspended';
import ErrorDisplay from '../ErrorDisplay';
import useAsyncFunction from '../useAsyncFunction';
import useAutocommitFormResponseOnChange from '../FormPresenter/useAutocommitFormResponseOnChange';
import useFormResponse from '../FormPresenter/useFormResponse';
import { useItemInteractionTracking, ItemInteractionTrackerContext } from '../FormPresenter/ItemInteractionTracker';
import LoadingIndicator from '../LoadingIndicator';
import usePageTitle from '../usePageTitle';

function parseResponseErrors(error) {
  const { graphQLErrors } = error;
  const updateError = graphQLErrors.find((graphQLError) => isEqual(graphQLError.path, ['updateUserConProfile']));
  const { validationErrors } = (updateError || {});
  return validationErrors;
}

function MyProfileForm({ initialSetup }) {
  const { data, error } = useQuerySuspended(MyProfileQuery);
  const [updateMutate] = useMutation(UpdateUserConProfile);
  const [mutate, , mutationInProgress] = useAsyncFunction(updateMutate);
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
  const itemInteractionProps = useItemInteractionTracking();

  useAutocommitFormResponseOnChange(updateUserConProfile, userConProfile);

  usePageTitle(`${initialSetup ? 'Set up' : 'Editing'} my profile`);

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
      <h1 className="mb-4">
        {`My ${convention.name} profile`}
      </h1>

      {initialSetup && (
        <div className="alert alert-success mb-4">
          Welcome to
          {' '}
          {convention.name}
          !  You haven&rsquo;t signed
          into this convention before, so please take a moment to update your profile.
        </div>
      )}
      <ItemInteractionTrackerContext.Provider value={itemInteractionProps}>
        <SinglePageFormPresenter {...formPresenterProps} />
      </ItemInteractionTrackerContext.Provider>

      <div className="my-4">
        {
          initialSetup
            ? (
              <Link to="/" className="btn btn-primary">
                Finish
              </Link>
            )
            : (
              <Link to="/my_profile" className="btn btn-primary">
                Finish and return to my profile
              </Link>
            )
        }
        {mutationInProgress && <span className="ml-2"><LoadingIndicator /></span>}
      </div>
    </>
  );
}

MyProfileForm.propTypes = {
  initialSetup: PropTypes.bool,
};

MyProfileForm.defaultProps = {
  initialSetup: false,
};

export default MyProfileForm;
