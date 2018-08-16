import React from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { Manager, Reference, Popper } from 'react-popper';
import classNames from 'classnames';
import onClickOutside from 'react-onclickoutside';

class PopperDropdownContent extends React.Component {
  static propTypes = {
    handleClickOutside: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
    getPopperRef: PropTypes.func.isRequired,
    style: PropTypes.shape({}).isRequired,
    placement: PropTypes.string.isRequired,
    suppressWrapperDiv: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
  }

  handleClickOutside = () => { this.props.handleClickOutside(); }

  render = () => {
    if (this.props.suppressWrapperDiv) {
      return this.props.children;
    }

    return (
      <div
        className={classNames('dropdown-menu', { show: this.props.visible })}
        ref={this.props.getPopperRef}
        style={this.props.style}
        data-placement={this.props.placement}
      >
        {this.props.children}
      </div>
    );
  }
}

const PopperDropdownContentWithOnClickOutside = onClickOutside(PopperDropdownContent);

// eslint-disable-next-line react/no-multi-comp
class PopperDropdown extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
    placement: PropTypes.string,
    renderReference: PropTypes.func.isRequired,
  };

  static defaultProps = {
    children: null,
    placement: 'bottom-start',
  };

  constructor(props) {
    super(props);

    this.state = {
      visible: false,
    };
  }

  handleClickOutside = (event) => {
    // eslint-disable-next-line react/no-find-dom-node
    if (this.managerNode && findDOMNode(this.managerNode).contains(event.target)) {
      return;
    }

    if (this.state.visible) {
      this.setState({ visible: false });
    }
  }

  targetClicked = () => {
    this.setState(prevState => ({ visible: !prevState.visible }));
  }

  render = () => {
    const {
      placement,
      children,
      renderReference,
    } = this.props;

    return (
      <Manager ref={(manager) => { this.managerNode = manager; }}>
        <Reference>
          {({ ref }) => renderReference({ ref, toggle: this.targetClicked })}
        </Reference>
        <Popper placement={this.state.visible ? (placement || 'bottom-start') : undefined}>
          {({ ref, style, ...otherProps }) => (
            <PopperDropdownContentWithOnClickOutside
              getPopperRef={ref}
              style={style}
              placement={placement}
              visible={this.state.visible}
              handleClickOutside={this.handleClickOutside}
              suppressWrapperDiv={typeof children === 'function'}
            >
              {
                typeof children === 'function'
                  ? children({
                    ref,
                    style,
                    visible: this.state.visible,
                    ...otherProps,
                  })
                  : children
              }
            </PopperDropdownContentWithOnClickOutside>
          )}
        </Popper>
      </Manager>
    );
  }
}


export default PopperDropdown;
