import Select, { GroupBase, Props } from 'react-select';
import { Room } from '../graphqlTypes.generated';

export type RoomForSelect = Pick<Room, '__typename' | 'name'> & { id: string };
export type RoomSelectProps<OptionType extends RoomForSelect, IsMulti extends boolean = boolean> = Omit<
  Props<OptionType, IsMulti, GroupBase<OptionType>>,
  'options' | 'getOptionValue' | 'getOptionLabel' | 'styles'
> & {
  rooms: OptionType[];
};

function RoomSelect<OptionType extends RoomForSelect, IsMulti extends boolean = boolean>({
  rooms,
  ...otherProps
}: RoomSelectProps<OptionType, IsMulti>): React.JSX.Element {
  return (
    <Select<OptionType, IsMulti, GroupBase<OptionType>>
      options={rooms}
      getOptionValue={(room) => room.id}
      getOptionLabel={(room) => room.name ?? ''}
      styles={{
        menu: (provided) => ({ ...provided, zIndex: 25 }),
      }}
      {...otherProps}
    />
  );
}

export default RoomSelect;
