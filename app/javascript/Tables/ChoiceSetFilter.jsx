import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Manager, Reference, Popper } from 'react-popper';

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
      value: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
    }),
    renderHeaderCaption: PropTypes.func,
  }

  static defaultProps = {
    filter: null,
    renderHeaderCaption: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
    };
  }

  uncollapse = () => { this.setState({ collapsed: false }); }

  collapse = () => { this.setState({ collapsed: true }); }

  renderHeaderCaption = () => {
    if (!this.state.collapsed) {
      return null;
    }

    const filterValue = (this.props.filter || {}).value || [];

    if (this.props.renderHeaderCaption) {
      return <span className="mr-2">{this.props.renderHeaderCaption(filterValue)}</span>;
    }

    if (Array.isArray(filterValue)) {
      if (filterValue.length > 0) {
        return sortChoices(filterValue.map(
          item => (
            this.props.choices.find(choice => choice.value === item)
            || { label: item }
          ),
        )).map(({ label }) => <span className="mr-2">{label}</span>);
      }

      return <span className="mr-2">Any</span>;
    }

    return <span className="mr-2">{filterValue || 'Any'}</span>;
  }

  renderHeader = () => (
    <div className="card-header p-1 d-flex">
      <div className="flex-grow-1 d-flex flex-wrap" style={{ overflow: 'hidden' }}>
        {this.renderHeaderCaption()}
      </div>
      <button type="button" className="btn btn-outline-secondary btn-sm py-0 align-self-start" onClick={this.state.collapsed ? this.uncollapse : this.collapse}>
        <i className={classNames('fa', { 'fa-caret-down': this.state.collapsed, 'fa-caret-up': !this.state.collapsed })} />
      </button>
    </div>
  )

  render = () => {
    const { filter, choices, ...otherProps } = this.props;

    const filterValue = (filter || {}).value || [];

    return (
      <Manager>
        <Reference>
          {({ ref }) => (
            <div className="card" ref={ref}>
              {this.renderHeader()}
            </div>
          )}
        </Reference>
        <Popper
          placement="top-start"
          modifiers={{
            inner: { enabled: true, order: 700 },
            matchWidth: {
              enabled: true,
              order: 750,
              fn: (data) => {
                const { popper, reference } = data.offsets;
                popper.width = reference.width;
                return data;
              },
            },
            addWidthStyle: {
              enabled: true,
              order: 875,
              fn: data => ({
                ...data,
                styles: { ...data.styles, width: `${data.offsets.popper.width}px` },
              }),
            },
          }}
        >
          {({ ref, style, placement }) => (
            <div className={classNames('card', { 'd-none': this.state.collapsed })} ref={ref} style={style} data-placement={placement}>
              {this.renderHeader()}
              <div className="card-body p-1">
                <ChoiceSet
                  value={filterValue}
                  choices={sortChoices(choices)}
                  multiple
                  {...otherProps}
                />
              </div>
            </div>
          )}
        </Popper>
      </Manager>
    );
  }
}

export default ChoiceSetFilter;
