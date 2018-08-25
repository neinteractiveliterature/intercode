import React from 'react';
import PropTypes from 'prop-types';

import ChoiceSet from '../BuiltInFormControls/ChoiceSet';

function sortChoices(choices) {
  return [...choices].sort((
    { label: labelA },
    { label: labelB },
  ) => labelA.localeCompare(labelB, { sensitivity: 'base' }));
}

class ChoiceSetFilter extends React.Component {
  static propTypes = {
    choices: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      }),
    ).isRequired,
    filter: PropTypes.shape({
      value: PropTypes.arrayOf(PropTypes.string),
    }),
  }

  static defaultProps = {
    filter: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
    };
  }

  uncollapse = () => { this.setState({ collapsed: false }); }

  collapse = () => { this.setState({ collapsed: true }); }

  render = () => {
    const { filter, choices, ...otherProps } = this.props;

    const filterValue = (filter || {}).value || [];

    if (this.state.collapsed) {
      return (
        <div className="card">
          <div className="card-header p-1 d-flex">
            <div className="flex-grow-1 d-flex flex-wrap" style={{ overflow: 'hidden' }}>
              {
                (filterValue.length > 0)
                  ? sortChoices(filterValue.map(
                    item => (
                      choices.find(choice => choice.value === item)
                      || { label: item }
                    ),
                  )).map(({ label }) => <span className="mr-2">{label}</span>)
                  : <span>Any</span>
              }
            </div>
            <button type="button" className="btn btn-outline-secondary btn-sm py-0 align-self-start" onClick={this.uncollapse}>
              <i className="fa fa-plus" />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="card">
        <div className="card-header p-1 text-right">
          <button type="button" className="btn btn-outline-secondary btn-sm py-0" onClick={this.collapse}>
            <i className="fa fa-minus" />
          </button>
        </div>
        <div className="card-body p-1">
          <ChoiceSet
            value={filterValue}
            choices={sortChoices(choices)}
            multiple
            {...otherProps}
          />
        </div>
      </div>
    );
  }
}

export default ChoiceSetFilter;
