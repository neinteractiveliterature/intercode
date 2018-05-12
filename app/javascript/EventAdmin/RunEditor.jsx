import React from 'react';
import PropTypes from 'prop-types';

const RunEditorContext = React.createContext({
  newRun: () => {},
  editRun: () => {},
});

export default class RunEditor extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  static Trigger = RunEditorContext.Consumer;

  constructor(props) {
    super(props);

    this.state = {
      event: null,
      run: null,
    };
  }

  render = () => (
    <RunEditorContext.Provider
      value={{
        event: this.state.event,
        run: this.state.run,
      }}
    >
      {this.props.children}
    </RunEditorContext.Provider>
  )
}
