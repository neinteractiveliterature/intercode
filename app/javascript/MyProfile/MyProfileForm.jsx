import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import isEqual from 'lodash/isEqual';
import { useMutation, useQuery } from '@apollo/react-hooks';
import MD5 from 'md5.js';
import { useTranslation, Trans } from 'react-i18next';

import buildFormStateFromData from '../UserConProfiles/buildFormStateFromData';
import SinglePageFormPresenter from '../FormPresenter/SinglePageFormPresenter';
import { MyProfileQuery } from './queries.gql';
import { UpdateUserConProfile } from '../UserConProfiles/mutations.gql';
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
import PageLoadingIndicator from '../PageLoadingIndicator';

function parseResponseErrors(error) {
  const { graphQLErrors } = error;
  const updateError = graphQLErrors.find((graphQLError) => isEqual(graphQLError.path, ['updateUserConProfile']));
  const { validationErrors } = ((updateError || {}).extensions || {});
  return validationErrors;
}

function MyProfileFormInner({
  initialSetup, initialUserConProfile, convention, form,
}) {
  const { t } = useTranslation();
  const [updateMutate] = useMutation(UpdateUserConProfile);
  const [mutate, , mutationInProgress] = useAsyncFunction(updateMutate);
  const [responseErrors, setResponseErrors] = useState({});

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

  const formPresenterProps = {
    form,
    convention,
    response,
    responseErrors,
    isSubmittingResponse: false,
    isUpdatingResponse: mutationInProgress,
    responseValuesChanged,
    submitForm: () => { },
  };

  return (
    <>
      <h1 className="mb-4">
        {t('myProfile.title', 'My {{ conventionName }} profile', { conventionName: convention.name })}
      </h1>

      {initialSetup && (
        <div className="alert alert-success mb-4">
          {t(
            'myProfile.initialSetupText',
            'Welcome to {{ conventionName }}!  You haven’t signed into this convention before, so please take a moment to update your profile.',
            { conventionName: convention.name },
          )}
        </div>
      )}
      <ItemInteractionTrackerContext.Provider value={itemInteractionProps}>
        <SinglePageFormPresenter {...formPresenterProps} />
      </ItemInteractionTrackerContext.Provider>

      {initialUserConProfile.can_have_bio && (
        <>
          <div className="form-group">
            <legend className="col-form-label">
              {t('myProfile.bioLabel', 'Bio')}
            </legend>
            <MarkdownInput value={userConProfile.bio} onChange={setBio} />
            <small className="form-text text-muted">
              <Trans i18nKey="general.editors.markdownHelpText">
                {'Use '}
                <a
                  href="https://en.support.wordpress.com/markdown-quick-reference/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Markdown syntax
                </a>
                {' for formatting.'}
              </Trans>
            </small>
          </div>

          <BooleanInput
            caption={t('myProfile.bioNicknameLabel', 'Show nickname (if any) in bio')}
            value={userConProfile.show_nickname_in_bio}
            onChange={setShowNickname}
            helpText={t(
              'myProfile.bioNicknameHelpText',
              'Your name will appear in your bio as {{ name }}.',
              {
                name: `${userConProfile.form_response_attrs.first_name}
                  ${(userConProfile.show_nickname_in_bio && userConProfile.form_response_attrs.nickname)
                  ? `“${userConProfile.form_response_attrs.nickname}”`
                  : ''}
                  ${userConProfile.form_response_attrs.last_name}`,
              },
            )}
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
                {t('myProfile.gravatarEnabledLabel', 'Enable Gravatar for my profile')}
              </>
            )}
            value={userConProfile.gravatar_enabled}
            onChange={setGravatarEnabled}
            helpText={(
              <Trans i18nKey="myProfile.gravatarEnabledHelpText">
                Gravatar is a service that lets you create a globally-recognized avatar attached to
                your email address. For more information or to set up a Gravatar,
                {' '}
                <a href="https://gravatar.com" target="_blank" rel="noopener noreferrer">
                  visit gravatar.com
                </a>
                .
              </Trans>
            )}
          />
        </div>
      </div>

      <div className="my-4">
        {
          initialSetup
            ? (
              <Link to="/" className="btn btn-primary">
                {t('myProfile.initialSetupFinishButton', 'Finish')}
              </Link>
            )
            : (
              <Link to="/my_profile" className="btn btn-primary">
                {t('myProfile.profileEditFinishButton', 'Finish and return to my profile')}
              </Link>
            )
        }
        {mutationInProgress && <span className="ml-2"><LoadingIndicator /></span>}
      </div>
    </>
  );
}

MyProfileFormInner.propTypes = {
  initialSetup: PropTypes.bool.isRequired,
  initialUserConProfile: PropTypes.shape({
    can_have_bio: PropTypes.bool,
  }).isRequired,
  convention: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  form: PropTypes.shape({}).isRequired,
};

function MyProfileForm({ initialSetup }) {
  const { data, loading, error } = useQuery(MyProfileQuery);

  const formState = useMemo(
    () => (loading || error ? null : buildFormStateFromData(data.myProfile, data.convention)),
    [loading, error, data],
  );

  usePageTitle(`${initialSetup ? 'Set up' : 'Editing'} my profile`);

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <MyProfileFormInner
      initialUserConProfile={formState.userConProfile}
      convention={formState.convention}
      form={formState.form}
      initialSetup={initialSetup || false}
    />
  );
}

MyProfileForm.propTypes = {
  initialSetup: PropTypes.bool,
};

MyProfileForm.defaultProps = {
  initialSetup: false,
};

export default MyProfileForm;
