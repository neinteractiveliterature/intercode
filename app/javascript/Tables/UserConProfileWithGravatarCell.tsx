import Gravatar from '../Gravatar';
import { UserConProfile } from '../graphqlTypes.generated';

export type UserConProfileWithGravatarCellProps = {
  value: Pick<UserConProfile, 'gravatar_enabled' | 'gravatar_url' | 'name_inverted'>;
};

function UserConProfileWithGravatarCell({
  value,
}: UserConProfileWithGravatarCellProps): JSX.Element {
  return (
    <>
      <Gravatar url={value.gravatar_url} enabled={value.gravatar_enabled} pixelSize={16} />{' '}
      {value.name_inverted}
    </>
  );
}

export default UserConProfileWithGravatarCell;
