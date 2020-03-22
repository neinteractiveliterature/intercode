import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

function RoomSelect({ rooms, ...otherProps }) {
  return (
    <Select
      options={rooms}
      getOptionValue={(room) => room.id}
      getOptionLabel={(room) => room.name}
      styles={{
        menu: (provided) => ({ ...provided, zIndex: 25 }),
      }}
      {...otherProps}
    />
  );
}

RoomSelect.propTypes = {
  rooms: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
};

export default RoomSelect;
