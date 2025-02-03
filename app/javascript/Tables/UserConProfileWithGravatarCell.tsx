import { CellContext } from '@tanstack/react-table';
import Gravatar from '../Gravatar';
import { UserConProfile } from '../graphqlTypes.generated';

function UserConProfileWithGravatarCell<
  TData,
  TValue extends Pick<UserConProfile, 'gravatar_enabled' | 'gravatar_url' | 'name_inverted'>,
>({ getValue }: CellContext<TData, TValue>): JSX.Element {
  const value = getValue();
  return (
    <>
      <Gravatar url={value.gravatar_url} enabled={value.gravatar_enabled} pixelSize={16} /> {value.name_inverted}
    </>
  );
}

export default UserConProfileWithGravatarCell;
