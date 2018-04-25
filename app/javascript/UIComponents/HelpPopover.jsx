import React from 'react';
import PropTypes from 'prop-types';
import { Manager, Target, Popper, Arrow } from 'react-popper';
import classNames from 'classnames';
import onClickOutside from 'react-onclickoutside';

@onClickOutside
class HelpPopover extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
  };

  static defaultProps = {
    children: null,
    className: null,
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
    const { children, className } = this.props;

    return (
      <Manager tag="span">
        <Target onClick={this.targetClicked} className={classNames('d-inline', className)}>
          <i className="fa fa-question-circle" style={{ cursor: 'pointer' }}>
            <span className="sr-only">Help</span>
          </i>
        </Target>
        <Popper>
          {({ popperProps }) => (
            <div
              className={classNames(
                'card',
                'popover',
                `bs-popover-${popperProps['data-placement']}`,
                { 'd-none': !this.state.visible },
              )}
              {...popperProps}
            >
              <div className="card-body">
                {children}
              </div>
              <Arrow>
                {({ arrowProps }) => (
                  <span
                    className="arrow"
                    {...arrowProps}
                  />
                )}
              </Arrow>
            </div>
          )}
        </Popper>
      </Manager>
    );
  }
}


export default HelpPopover;
