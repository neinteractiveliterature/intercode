import React, { useState } from 'react';
import PropTypes from 'prop-types';

import MarkdownInput from '../BuiltInFormControls/MarkdownInput';
import BooleanInput from '../BuiltInFormControls/BooleanInput';
import { UpdateUserConProfile } from '../UserConProfiles/mutations.gql';
import useAsyncFunction from '../useAsyncFunction';
import useMutationCallback from '../useMutationCallback';
import ErrorDisplay from '../ErrorDisplay';

function BioForm({ userConProfile, history }) {
  const [bio, setBio] = useState(userConProfile.bio || '');
  const [showNickname, setShowNickname] = useState(userConProfile.show_nickname_in_bio);
  const [gravatarEnabled, setGravatarEnabled] = useState(userConProfile.gravatar_enabled);
  const [update, updateError, updateInProgress] = useAsyncFunction(
    useMutationCallback(UpdateUserConProfile),
  );

  const formSubmitted = async (event) => {
    event.preventDefault();

    await update({
      variables: {
        input: {
          id: userConProfile.id,
          user_con_profile: {
            bio,
            show_nickname_in_bio: showNickname,
            gravatar_enabled: gravatarEnabled,
          },
        },
      },
    });

    history.push('/');
  };

  return (
    <form onSubmit={formSubmitted}>
      <div className="form-group">
        <legend className="col-form-label">
          Bio
        </legend>
        <MarkdownInput value={bio} onChange={setBio} />
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
        value={showNickname}
        onChange={setShowNickname}
      />

      <BooleanInput
        caption={(
          <>
            Enable Gravatar for my account
            <br />
            <small className="text-muted">
              Gravatar is a service that lets you create a globally-recognized avatar attached to
              your email address. For more information or to set up a Gravatar,
              {' '}
              <a href="https://gravatar.com" target="_blank" rel="noopener noreferrer">
                visit gravatar.com
              </a>
              .
            </small>
          </>
        )}
        value={gravatarEnabled}
        onChange={setGravatarEnabled}
      />

      <ErrorDisplay graphQLError={updateError} />

      <input type="submit" className="btn btn-primary mt-2" value="Save bio" disabled={updateInProgress} />
    </form>
  );
}

BioForm.propTypes = {
  userConProfile: PropTypes.shape({
    id: PropTypes.number.isRequired,
    bio: PropTypes.string,
    show_nickname_in_bio: PropTypes.bool,
    gravatar_enabled: PropTypes.bool,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default BioForm;
