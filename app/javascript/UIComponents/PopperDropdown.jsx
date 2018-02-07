import React from 'react';
import PropTypes from 'prop-types';
import { Manager, Target, Popper } from 'react-popper';
import classNames from 'classnames';
import onClickOutside from 'react-onclickoutside';

@onClickOutside
class PopperDropdown extends React.Component {
  static propTypes = {
    caption: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    children: PropTypes.node,
    placement: PropTypes.string,
    className: PropTypes.string,
    targetProps: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  };

  static defaultProps = {
    children: null,
    placement: 'bottom-start',
    className: null,
    targetProps: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      visible: false,
    };
  }

  handleClickOutside = () => {
    if (this.state.visible) {
      this.setState({ visible: false });
    }
  }

  targetClicked = () => {
    this.setState({ visible: !this.state.visible });
  }

  render = () => {
    const {
      caption,
      placement,
      children,
      className,
      targetProps,
    } = this.props;

    return (
      <Manager>
        <Target onClick={this.targetClicked} className={classNames('dropdown-toggle', className)} {...targetProps}>
          {caption}
        </Target>
        <Popper placement={placement || 'bottom-start'}>
          {({ popperProps }) => (
            <div className={classNames('dropdown-menu', { show: this.state.visible })} {...popperProps}>
              {children}
            </div>
          )}
        </Popper>
      </Manager>
    );
  }
}


export default PopperDropdown;
