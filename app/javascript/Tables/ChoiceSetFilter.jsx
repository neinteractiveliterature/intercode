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

const ValueType = PropTypes.oneOfType([PropTypes.number, PropTypes.string]);

class ChoiceSetFilter extends React.Component {
  static propTypes = {
    choices: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: ValueType.isRequired,
      }),
    ).isRequired,
    filter: PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.arrayOf(ValueType), ValueType]),
    }),
    filterCodec: PropTypes.shape({
      decode: PropTypes.func.isRequired,
      encode: PropTypes.func.isRequired,
    }),
    multiple: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    renderHeaderCaption: PropTypes.func,
  }

  static defaultProps = {
    multiple: true,
    filter: null,
    filterCodec: null,
    renderHeaderCaption: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
    };
  }

  getFilterValue = () => {
    const filterValue = (this.props.filter || {}).value || [];
    if (this.props.filterCodec) {
      if (this.props.multiple) {
        return filterValue.map(singleValue => this.props.filterCodec.encode(singleValue));
      }

      return this.props.filterCodec.encode(filterValue);
    }
    return filterValue;
  }

  getChoices = () => {
    if (this.props.filterCodec) {
      return sortChoices(this.props.choices.map(choice => ({
        ...choice,
        value: this.props.filterCodec.encode(choice.value),
      })));
    }

    return sortChoices(this.props.choices);
  }

  onChange = (value) => {
    if (this.props.filterCodec) {
      if (this.props.multiple) {
        this.props.onChange(value.map(singleValue => this.props.filterCodec.decode(singleValue)));
      } else {
        this.props.onChange(this.props.filterCodec.decode(value));
      }
    }
    this.props.onChange(value);
  }

  uncollapse = () => { this.setState({ collapsed: false }); }

  collapse = () => { this.setState({ collapsed: true }); }

  renderHeaderCaption = () => {
    if (!this.state.collapsed) {
      return null;
    }

    const filterValue = this.getFilterValue();

    if (this.props.renderHeaderCaption) {
      return <span className="mr-2">{this.props.renderHeaderCaption(filterValue)}</span>;
    }

    const choices = this.getChoices();

    if (Array.isArray(filterValue)) {
      if (filterValue.length > 0) {
        return filterValue.map(
          item => (
            choices.find(choice => choice.value === item)
            || { label: item }
          ),
        ).map(({ label }) => <span key={label} className="mr-2">{label}</span>);
      }

      return <span className="mr-2">Any</span>;
    }

    const choice = choices.find(c => c.value === filterValue) || { label: filterValue };
    return <span className="mr-2">{choice.label || 'Any'}</span>;
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
    const {
      filter, choices, onChange, ...otherProps
    } = this.props;

    const filterValue = this.getFilterValue();

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
          placement="bottom-start"
          modifiers={{
            matchWidth: {
              enabled: true,
              order: 750,
              fn: (data) => {
                const { popper, reference } = data.offsets;
                if (popper.width < reference.width) {
                  popper.width = reference.width;
                }
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
            <div
              className={classNames('card align-items-start', { invisible: this.state.collapsed })}
              ref={ref}
              style={{
                ...style,
                marginTop: '-3px',
                borderTop: 'none',
              }}
              data-placement={placement}
            >
              <div className="card-body p-1">
                <ChoiceSet
                  value={filterValue}
                  choices={this.getChoices()}
                  onChange={this.onChange}
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
