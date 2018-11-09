import React from 'react';
import PropTypes from 'prop-types';
import Clipboard from 'react-clipboard.js';

class CopyToClipboardButton extends React.Component {
  static propTypes = {
    copiedProps: PropTypes.shape({}),
  }

  static defaultProps = {
    copiedProps: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      copied: false,
    };
  }

  onSuccess = () => {
    if (this.state.copied) {
      return;
    }

    this.setState({ copied: true });
    window.setTimeout(() => { this.setState({ copied: false }); }, 2000);
  }

  render = () => (
    <Clipboard
      {...this.props}
      {...this.state.copied ? (this.props.copiedProps || {}) : {}}
      onSuccess={this.onSuccess}
    >
      <i className="fa fa-copy" />
      {' '}
      {
        this.state.copied
          ? 'Copied!'
          : 'Copy to clipboard'
      }
    </Clipboard>
  )
}

export default CopyToClipboardButton;
