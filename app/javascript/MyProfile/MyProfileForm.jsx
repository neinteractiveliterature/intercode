import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import isEqual from 'lodash-es/isEqual';
import { useMutation } from 'react-apollo-hooks';
import MD5 from 'md5.js';

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
import MarkdownInput from '../BuiltInFormControls/MarkdownInput';
import BooleanInput from '../BuiltInFormControls/BooleanInput';
import Gravatar from '../Gravatar';

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
                bio: profile.bio,
                show_nickname_in_bio: profile.show_nickname_in_bio,
                gravatar_enabled: profile.gravatar_enabled,
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

  const debouncedCommit = useAutocommitFormResponseOnChange(updateUserConProfile, userConProfile);

  const setBio = useCallback(
    (bio) => {
      setUserConProfile((prevUserConProfile) => ({ ...prevUserConProfile, bio }));
      debouncedCommit({ ...userConProfile, bio });
    },
    [debouncedCommit, userConProfile],
  );

  const setShowNickname = useCallback(
    (showNickname) => {
      setUserConProfile((prevUserConProfile) => ({
        ...prevUserConProfile, show_nickname_in_bio: showNickname,
      }));
      updateUserConProfile({
        ...userConProfile, show_nickname_in_bio: showNickname,
      });
    },
    [updateUserConProfile, userConProfile],
  );

  const setGravatarEnabled = useCallback(
    (gravatarEnabled) => {
      setUserConProfile((prevUserConProfile) => ({
        ...prevUserConProfile, gravatar_enabled: gravatarEnabled,
      }));
      updateUserConProfile({
        ...userConProfile, gravatar_enabled: gravatarEnabled,
      });
    },
    [updateUserConProfile, userConProfile],
  );

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

      {initialUserConProfile.can_have_bio && (
        <>
          <div className="form-group">
            <legend className="col-form-label">
              Bio
            </legend>
            <MarkdownInput value={userConProfile.bio} onChange={setBio} />
            <small className="form-text text-muted">
              {'Use '}
              <a
                href="https://en.support.wordpress.com/markdown-quick-reference/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Markdown syntax
              </a>
              {' for formatting.'}
            </small>
          </div>

          <BooleanInput
            caption="Show nickname (if any) in bio"
            value={userConProfile.show_nickname_in_bio}
            onChange={setShowNickname}
            helpText={
              `Your name will appear in your bio as ${userConProfile.form_response_attrs.first_name}
              ${(userConProfile.show_nickname_in_bio && userConProfile.form_response_attrs.nickname)
                ? `“${userConProfile.form_response_attrs.nickname}”`
                : ''}
              ${userConProfile.form_response_attrs.last_name}.`
            }
          />
        </>
      )}

      <div className="d-flex align-items-center">
        <div>
          <BooleanInput
            caption={(
              <>
                <Gravatar
                  url={`https://gravatar.com/avatar/${new MD5().update(userConProfile.email.trim().toLowerCase()).digest('hex')}`}
                  enabled={userConProfile.gravatar_enabled}
                  pixelSize={32}
                  imgClassName="align-baseline"
                />
                {' '}
                Enable Gravatar for my profile
              </>
            )}
            value={userConProfile.gravatar_enabled}
            onChange={setGravatarEnabled}
            helpText={(
              <>
                Gravatar is a service that lets you create a globally-recognized avatar attached to
                your email address. For more information or to set up a Gravatar,
                {' '}
                <a href="https://gravatar.com" target="_blank" rel="noopener noreferrer">
                  visit gravatar.com
                </a>
                .
              </>
            )}
          />
        </div>
      </div>

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
