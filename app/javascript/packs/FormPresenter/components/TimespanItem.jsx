// @flow

import React from 'react';
import { enableUniqueIds } from 'react-html-id';

type Props = {
  formItem: {
    caption: string,
  },
};

type State = {
  unit: string,
};

class TimespanItem extends React.Component {
  static units = [
    { name: 'hour(s)', length_seconds: 60 * 60 },
    { name: 'minute(s)', length_seconds: 60 },
  ];

  constructor(props: Props) {
    super(props);
    enableUniqueIds(this);

    this.state = {
      unit: 'hour(s)',
    };
  }

  state: State
  props: Props
  nextUniqueId: () => string

  render = () => {
    const inputId = this.nextUniqueId();
    const options = TimespanItem.units.map(unit => (
      <option key={unit.length_seconds} value={unit.length_seconds}>{unit.name}</option>
    ));

    return (
      <div className="form-group">
        <label
          htmlFor={inputId}
          className="form-item-label"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: this.props.formItem.caption }}
        />
        <div className="d-flex">
          <input id={inputId} type="number" min="1" className="form-control w-25" />
          <select className="form-control ml-2">{options}</select>
        </div>
      </div>
    );
  };
}

export default TimespanItem;
