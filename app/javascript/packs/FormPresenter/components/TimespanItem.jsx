import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { enableUniqueIds } from 'react-html-id';

class TimespanItem extends React.Component {
  static units = [
    { name: 'hour(s)', length_seconds: 60 * 60 },
    { name: 'minute(s)', length_seconds: 60 },
  ];

  constructor(props) {
    super(props);
    enableUniqueIds(this);

    this.state = {
      unit: 'hour(s)',
    };
  }

  render = () => {
    const { formItem } = this.props;
    const inputId = this.nextUniqueId();
    const options = TimespanItem.units.map(unit => (
      <option key={unit.length_seconds} value={unit.length_seconds}>{unit.name}</option>
    ));

    return (
      <div className="form-group">
        <label htmlFor={inputId} className="form-item-label" dangerouslySetInnerHTML={{ __html: formItem.caption }} />
        <div className="d-flex">
          <input id={inputId} type="number" min="1" className="form-control w-25" />
          <select className="form-control ml-2">{options}</select>
        </div>
      </div>
    );
  };
}

export default TimespanItem;
