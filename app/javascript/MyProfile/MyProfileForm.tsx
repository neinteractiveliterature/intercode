import { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import md5 from 'md5';
import { useTranslation, Trans } from 'react-i18next';
import { BooleanInput, PageLoadingIndicator, LoadingIndicator, ErrorDisplay } from '@neinteractiveliterature/litform';

import buildFormStateFromData from '../UserConProfiles/buildFormStateFromData';
import SinglePageFormPresenter, { SinglePageFormPresenterProps } from '../FormPresenter/SinglePageFormPresenter';
import useAsyncFunction from '../useAsyncFunction';
import useAutocommitFormResponseOnChange from '../FormPresenter/useAutocommitFormResponseOnChange';
import useFormResponse from '../FormPresenter/useFormResponse';
import { useItemInteractionTracking, ItemInteractionTrackerContext } from '../FormPresenter/ItemInteractionTracker';
import usePageTitle from '../usePageTitle';
import MarkdownInput from '../BuiltInFormControls/MarkdownInput';
import Gravatar from '../Gravatar';
import { useMyProfileQuery, MyProfileQueryData, MyProfileQueryDocument } from './queries.generated';
import { CommonFormFieldsFragment } from '../Models/commonFormFragments.generated';
import { useUpdateUserConProfileMutation } from '../UserConProfiles/mutations.generated';
import { WithFormResponse } from '../Models/deserializeFormResponse';
import FourOhFourPage from '../FourOhFourPage';
import { parseResponseErrors } from '../parseResponseErrors';

type MyProfileFormInnerProps = {
  initialSetup?: boolean;
  initialUserConProfile: WithFormResponse<NonNullable<MyProfileQueryData['convention']['my_profile']>>;
  convention: NonNullable<MyProfileQueryData['convention']>;
  form: CommonFormFieldsFragment;
};

function MyProfileFormInner({ initialSetup, initialUserConProfile, convention, form }: MyProfileFormInnerProps) {
  const { t } = useTranslation();
  const [updateMutate] = useUpdateUserConProfileMutation();
  const [mutate, , mutationInProgress] = useAsyncFunction(updateMutate);
  const [responseErrors, setResponseErrors] = useState<Record<string, string[]>>({});

  const [userConProfile, setUserConProfile] = useState(initialUserConProfile);
  const [, responseValuesChanged] = useFormResponse(userConProfile, setUserConProfile);

  const updateUserConProfile = useCallback(
    async (profile: typeof userConProfile) => {
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
          refetchQueries: [MyProfileQueryDocument],
        });
      } catch (e) {
        setResponseErrors(parseResponseErrors(e, ['updateUserConProfile']));
      }
    },
    [mutate],
  );
  const itemInteractionProps = useItemInteractionTracking();

  const debouncedCommit = useAutocommitFormResponseOnChange(updateUserConProfile, userConProfile);

  const setBio = useCallback(
    (bio: string) => {
      setUserConProfile((prevUserConProfile) => ({ ...prevUserConProfile, bio }));
      debouncedCommit({ ...userConProfile, bio });
    },
    [debouncedCommit, userConProfile],
  );

  const setShowNickname = useCallback(
    (showNickname: boolean) => {
      setUserConProfile((prevUserConProfile) => ({
        ...prevUserConProfile,
        show_nickname_in_bio: showNickname,
      }));
      updateUserConProfile({
        ...userConProfile,
        show_nickname_in_bio: showNickname,
      });
    },
    [updateUserConProfile, userConProfile],
  );

  const setGravatarEnabled = useCallback(
    (gravatarEnabled: boolean) => {
      setUserConProfile((prevUserConProfile) => ({
        ...prevUserConProfile,
        gravatar_enabled: gravatarEnabled,
      }));
      updateUserConProfile({
        ...userConProfile,
        gravatar_enabled: gravatarEnabled,
      });
    },
    [updateUserConProfile, userConProfile],
  );

  const formPresenterProps: SinglePageFormPresenterProps = {
    form,
    convention,
    currentUserViewerRole: initialUserConProfile.current_user_form_item_viewer_role,
    currentUserWriterRole: initialUserConProfile.current_user_form_item_writer_role,
    response: userConProfile,
    responseErrors,
    responseValuesChanged,
  };

  return (
    <>
      <h1 className="mb-4">
        {t('myProfile.title', {
          conventionName: convention.name,
        })}
      </h1>
      {initialSetup && (
        <div className="alert alert-success mb-4">
          {t('myProfile.initialSetupText', { conventionName: convention.name })}
        </div>
      )}
      <ItemInteractionTrackerContext.Provider value={itemInteractionProps}>
        <SinglePageFormPresenter {...formPresenterProps} />
      </ItemInteractionTrackerContext.Provider>
      {initialUserConProfile.can_have_bio && (
        <>
          <div className="mb-3">
            <legend className="col-form-label">{t('myProfile.bioLabel')}</legend>
            <MarkdownInput value={userConProfile.bio ?? ''} onChange={setBio} />
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
            caption={t('myProfile.bioNicknameLabel')}
            value={userConProfile.show_nickname_in_bio ?? false}
            onChange={setShowNickname}
            helpText={t('myProfile.bioNicknameHelpText', {
              name: `${userConProfile.form_response_attrs.first_name}
                ${
                  userConProfile.show_nickname_in_bio && userConProfile.form_response_attrs.nickname
                    ? `“${userConProfile.form_response_attrs.nickname}”`
                    : ''
                }
                ${userConProfile.form_response_attrs.last_name}`,
            })}
          />
        </>
      )}
      <div className="d-flex align-items-center">
        <div>
          <BooleanInput
            caption={
              <>
                <Gravatar
                  url={`https://gravatar.com/avatar/${md5((userConProfile.email ?? '').trim().toLowerCase())}`}
                  enabled={userConProfile.gravatar_enabled}
                  pixelSize={32}
                  imgClassName="align-baseline"
                />{' '}
                {t('myProfile.gravatarEnabledLabel')}
              </>
            }
            value={userConProfile.gravatar_enabled}
            onChange={setGravatarEnabled}
            helpText={
              <Trans i18nKey="myProfile.gravatarEnabledHelpText">
                Gravatar is a service that lets you create a globally-recognized avatar attached to your email address.
                For more information or to set up a Gravatar,{' '}
                <a href="https://gravatar.com" target="_blank" rel="noopener noreferrer">
                  visit gravatar.com
                </a>
                .
              </Trans>
            }
          />
        </div>
      </div>
      <div className="my-4">
        {initialSetup ? (
          <Link to="/" className="btn btn-primary">
            {t('myProfile.initialSetupFinishButton')}
          </Link>
        ) : (
          <Link to="/my_profile" className="btn btn-primary">
            {t('myProfile.profileEditFinishButton')}
          </Link>
        )}
        {mutationInProgress && (
          <span className="ms-2">
            <LoadingIndicator iconSet="bootstrap-icons" />
          </span>
        )}
      </div>
    </>
  );
}

export type MyProfileFormProps = {
  initialSetup?: boolean;
};

function MyProfileForm({ initialSetup }: MyProfileFormProps): JSX.Element {
  const { data, loading, error } = useMyProfileQuery();

  const formState = useMemo(
    () =>
      loading || error || !data || !data.convention.my_profile
        ? null
        : buildFormStateFromData(data.convention.my_profile, data.convention),
    [loading, error, data],
  );

  usePageTitle(`${initialSetup ? 'Set up' : 'Editing'} my profile`);

  if (loading) {
    return <PageLoadingIndicator visible iconSet="bootstrap-icons" />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  if (!formState) {
    return <FourOhFourPage />;
  }

  return (
    <MyProfileFormInner
      initialUserConProfile={formState.userConProfile}
      convention={formState.convention}
      form={formState.form}
      initialSetup={initialSetup ?? false}
    />
  );
}

export default MyProfileForm;
