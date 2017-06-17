import React from 'react';
import PropTypes from 'prop-types';
import { enableUniqueIds } from 'react-html-id';
import classNames from 'classnames';

class ModalConfirm extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
    okText: PropTypes.string,
    cancelText: PropTypes.string,
    onClickOk: PropTypes.func.isRequired,
    onClickCancel: PropTypes.func.isRequired,
    onClose: PropTypes.func,
    visible: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    okText: 'OK',
    cancelText: 'Cancel',
    onClose: null,
  };

  constructor(props) {
    super(props);
    enableUniqueIds(this);

    this.state = {
      visible: this.props.visible,
    };
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.visible !== prevProps.visible) {
      this.setState({ transitioning: true }, () => {
        window.requestAnimationFrame(() => {
          this.setState({ visible: this.props.visible }, () => {
            window.setTimeout(() => { this.setState({ transitioning: false }); }, 150);
          });
        });
      });
    }
  }

  renderCloseButton = () => {
    if (!this.props.onClose) {
      return null;
    }

    return (
      <button type="button" className="close" onClick={this.props.onClose} aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    );
  }

  renderBackdrop = () => {
    if (this.state.visible || this.state.transitioning) {
      return (
        <div
          className={classNames('modal-backdrop', 'fade', { show: this.state.visible })}
          onClick={this.props.onClose}
          role="presentation"
        />
      );
    }

    return null;
  }

  render = () => {
    const titleId = this.nextUniqueId();

    return (
      <div>
        <div
          className={classNames('modal', 'fade', { show: this.state.visible })}
          style={{ display: ((this.state.visible || this.state.transitioning) ? 'block' : 'none') }}
          role="dialog"
          aria-labelledby={titleId}
          aria-hidden={!this.state.visible}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id={titleId}>{this.props.title}</h5>
                {this.renderCloseButton()}
              </div>
              <div className="modal-body">
                {this.props.children}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={this.props.onClickOk}
                >
                  {this.props.okText}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={this.props.onClickCancel}
                >
                  {this.props.cancelText}
                </button>
              </div>
            </div>
          </div>
        </div>
        {this.renderBackdrop()}
      </div>
    );
  }
}

export default ModalConfirm;
