import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Manager, Reference, Popper } from 'react-popper';

class SignupButtonDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showingHelpText: false,
    };
  }

  render = () => {
    const { signupOption, onClick, disabled } = this.props;
    return (
      <Manager>
        <Reference>
          {({ ref }) => (
            <button
              ref={ref}
              className={classNames('btn mx-1 mb-2', signupOption.buttonClass)}
              type="button"
              disabled={disabled}
              onClick={() => {
                if (onClick) {
                  onClick(signupOption);
                }
              }}
              onFocus={() => this.setState({ showingHelpText: true })}
              onBlur={() => this.setState({ showingHelpText: false })}
              onMouseOver={() => this.setState({ showingHelpText: true })}
              onMouseOut={() => this.setState({ showingHelpText: false })}
            >
              <strong>Sign up</strong>
              {
                signupOption.label
                  ? (
                    <>
                      <br />
                      {signupOption.label}
                    </>
                  )
                  : null
              }
            </button>
          )}
        </Reference>
        <Popper placement="bottom">
          {({
            ref, style, placement, arrowProps,
          }) => (
            <div
              ref={ref}
              style={{ ...style, ...(this.state.showingHelpText ? {} : { zIndex: -9999 }) }}
              className={classNames(
                `tooltip bs-tooltip-${placement}`,
                { show: this.state.showingHelpText, 'd-none': !this.state.showingHelpText },
              )}
              role="tooltip"
            >
              <div className="arrow" ref={arrowProps.ref} style={arrowProps.style} />
              <div className="tooltip-inner">{signupOption.helpText}</div>
            </div>
          )}
        </Popper>
      </Manager>
    );
  }
}

SignupButtonDisplay.propTypes = {
  signupOption: PropTypes.shape({
    buttonClass: PropTypes.string,
    helpText: PropTypes.string,
    label: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

SignupButtonDisplay.defaultProps = {
  onClick: null,
  disabled: false,
};

export default SignupButtonDisplay;
