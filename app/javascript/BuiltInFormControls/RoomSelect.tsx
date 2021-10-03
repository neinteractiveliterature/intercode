import Select, { Props } from 'react-select';
import { Room } from '../graphqlTypes.generated';

export type RoomForSelect = Pick<Room, '__typename' | 'id' | 'name'>;
export type RoomSelectProps = Omit<
  Props<RoomForSelect>,
  'options' | 'getOptionValue' | 'getOptionLabel' | 'styles'
> & {
  rooms: RoomForSelect[];
};

function RoomSelect({ rooms, ...otherProps }: RoomSelectProps): JSX.Element {
  return (
    <Select
      options={rooms}
      getOptionValue={(room) => room.id.toString()}
      getOptionLabel={(room) => room.name ?? ''}
      styles={{
        menu: (provided) => ({ ...provided, zIndex: 25 }),
      }}
      {...otherProps}
    />
  );
}

export default RoomSelect;
