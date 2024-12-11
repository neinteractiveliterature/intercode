import { useState } from 'react';
import { ActionFunction, Link, LoaderFunction, SubmitTarget, useFetcher, useLoaderData, useMatch } from 'react-router';
import md5 from 'md5';
import { useTranslation, Trans } from 'react-i18next';
import { BooleanInput, LoadingIndicator } from '@neinteractiveliterature/litform';

import buildFormStateFromData from '../UserConProfiles/buildFormStateFromData';
import SinglePageFormPresenter, { SinglePageFormPresenterProps } from '../FormPresenter/SinglePageFormPresenter';
import useAutocommitFormResponseOnChange from '../FormPresenter/useAutocommitFormResponseOnChange';
import useFormResponse from '../FormPresenter/useFormResponse';
import { useItemInteractionTracking, ItemInteractionTrackerContext } from '../FormPresenter/ItemInteractionTracker';
import usePageTitle from '../usePageTitle';
import MarkdownInput from '../BuiltInFormControls/MarkdownInput';
import Gravatar from '../Gravatar';
import { MyProfileQueryData, MyProfileQueryDocument } from './queries.generated';
import { CommonFormFieldsFragment } from '../Models/commonFormFragments.generated';
import { WithFormResponse } from '../Models/deserializeFormResponse';
import { parseResponseErrors } from '../parseResponseErrors';
import { client } from '../useIntercodeApolloClient';
import { UpdateUserConProfileDocument } from '../UserConProfiles/mutations.generated';

export async function action({ request }) {
  const profile = (await request.json()) as LoaderResult['initialUserConProfile'];

  try {
    await client.mutate({
      mutation: UpdateUserConProfileDocument,
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
      refetchQueries: [{ query: MyProfileQueryDocument }],
    });

    return null;
  } catch (e) {
    return parseResponseErrors(e, ['updateUserConProfile']);
  }
}

type LoaderResult = {
  initialUserConProfile: WithFormResponse<NonNullable<MyProfileQueryData['convention']['my_profile']>>;
  convention: NonNullable<MyProfileQueryData['convention']>;
  form: CommonFormFieldsFragment;
};

export async function loader() {
  const { data } = await client.query<MyProfileQueryData>({ query: MyProfileQueryDocument });
  const myProfile = data.convention.my_profile;
  if (!myProfile) {
    return new Response(null, { status: 404 });
  }
  const formState = buildFormStateFromData(myProfile, data.convention);

  return {
    initialUserConProfile: formState.userConProfile,
    convention: formState.convention,
    form: formState.form,
  } satisfies LoaderResult;
}

function MyProfileForm() {
  const { initialUserConProfile, convention, form } = useLoaderData() as LoaderResult;
  const { t } = useTranslation();
  const initialSetup = useMatch('/my_profile/setup');
  const fetcher = useFetcher();
  const responseErrors = fetcher.data;
  const mutationInProgress = fetcher.state !== 'idle';

  usePageTitle(`${initialSetup ? 'Set up' : 'Editing'} my profile`);

  const [userConProfile, setUserConProfile] = useState(initialUserConProfile);
  const [, responseValuesChanged] = useFormResponse(userConProfile, setUserConProfile);

  const updateUserConProfile = async (profile: typeof userConProfile) => {
    fetcher.submit(profile as SubmitTarget, { method: 'PATCH', encType: 'application/json' });
  };
  const itemInteractionProps = useItemInteractionTracking();

  const debouncedCommit = useAutocommitFormResponseOnChange(updateUserConProfile, userConProfile);

  const setBio = (bio: string) => {
    setUserConProfile((prevUserConProfile) => ({ ...prevUserConProfile, bio }));
    debouncedCommit({ ...userConProfile, bio });
  };

  const setShowNickname = (showNickname: boolean) => {
    setUserConProfile((prevUserConProfile) => ({
      ...prevUserConProfile,
      show_nickname_in_bio: showNickname,
    }));
    updateUserConProfile({
      ...userConProfile,
      show_nickname_in_bio: showNickname,
    });
  };

  const setGravatarEnabled = (gravatarEnabled: boolean) => {
    setUserConProfile((prevUserConProfile) => ({
      ...prevUserConProfile,
      gravatar_enabled: gravatarEnabled,
    }));
    updateUserConProfile({
      ...userConProfile,
      gravatar_enabled: gravatarEnabled,
    });
  };

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
      <div className="my-4 d-flex align-items-center">
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
            <LoadingIndicator iconSet="bootstrap-icons" size={8} />
          </span>
        )}
      </div>
    </>
  );
}

export default MyProfileForm;
