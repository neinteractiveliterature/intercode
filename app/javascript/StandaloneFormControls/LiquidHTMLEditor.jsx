import React from 'react';
import PropTypes from 'prop-types';

import LiquidInput from '../BuiltInFormControls/LiquidInput';

class LiquidHTMLEditor extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    initialContent: PropTypes.string,
    lines: PropTypes.number,
    codeMirrorOptions: PropTypes.shape({}),
  }

  static defaultProps = {
    initialContent: '',
    lines: 10,
    codeMirrorOptions: {},
  }

  constructor(props) {
    super(props);

    this.state = {
      content: props.initialContent,
    };
  }

  contentDidChange = (value) => {
    this.setState({ content: value });
  }

  render = () => {
    const {
      name, initialContent, codeMirrorOptions, ...otherProps
    } = this.props;

    return (
      <React.Fragment>
        <input type="hidden" name={this.props.name} value={this.state.content} />
        <LiquidInput
          value={this.state.content}
          onChange={this.contentDidChange}
          getPreviewContent={() => this.state.content}
          codeMirrorOptions={{
            lineNumbers: true,
            ...(codeMirrorOptions || {}),
          }}
          editorWrapperClassName="p-0"
          {...otherProps}
        />
      </React.Fragment>
    );
  };
}

export default LiquidHTMLEditor;
