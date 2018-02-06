import React from 'react';
import PropTypes from 'prop-types';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import defaultCodeMirrorOptions from '../defaultCodeMirrorOptions';

class LiquidHTMLEditor extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    initialContent: PropTypes.string,
  }

  static defaultProps = {
    initialContent: '',
  }

  constructor(props) {
    super(props);

    this.state = {
      content: props.initialContent,
    };
  }

  contentDidChange = (editor, data, value) => {
    this.setState({ content: value });
  }

  render = () => (
    <div className="form-control p-0">
      <input type="hidden" name={this.props.name} value={this.state.content} />
      <CodeMirror
        value={this.props.initialContent}
        options={{
          ...defaultCodeMirrorOptions,
          mode: 'liquid-html',
        }}
        onChange={this.contentDidChange}
      />
    </div>
  )
}

export default LiquidHTMLEditor;
