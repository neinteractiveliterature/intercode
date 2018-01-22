import React from 'react';
import PropTypes from 'prop-types';
import { Manager, Target, Popper } from 'react-popper';
import classNames from 'classnames';

class PopperDropdown extends React.Component {
  static propTypes = {
    caption: PropTypes.string.isRequired,
    children: PropTypes.node,
    placement: PropTypes.string,
    className: PropTypes.string,
  };

  static defaultProps = {
    children: null,
    placement: 'bottom-start',
    className: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      visible: false,
    };
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
      ...otherProps
    } = this.props;

    return (
      <Manager>
        <Target onClick={this.targetClicked} className={classNames('dropdown-toggle', className)} {...otherProps}>
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
