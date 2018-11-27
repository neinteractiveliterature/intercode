import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class RefreshButton extends React.Component {
  static propTypes = {
    refreshData: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
    };
  }

  render = () => (
    <button
      className="btn btn-link"
      type="button"
      disabled={this.state.refreshing}
      onClick={async () => {
        this.setState({ refreshing: true });
        try {
          await this.props.refreshData();
        } finally {
          this.setState({ refreshing: false });
        }
      }}
    >
      <i className={classNames('fa fa-refresh', { 'fa-spin': this.state.refreshing })} />
      <span className="d-none d-md-inline"> Refresh</span>
    </button>
  )
}

export default RefreshButton;
