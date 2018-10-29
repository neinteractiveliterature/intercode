import React from 'react';
import PropTypes from 'prop-types';
import { Controlled as CodeMirror } from 'react-codemirror2';
import classNames from 'classnames';
import defaultCodeMirrorOptions from '../defaultCodeMirrorOptions';
import ErrorDisplay from '../ErrorDisplay';
import LoadingIndicator from '../LoadingIndicator';

class CodeInput extends React.Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    getPreviewContent: PropTypes.func.isRequired,
    mode: PropTypes.string.isRequired,
    onBlur: PropTypes.func,
    className: PropTypes.string,
    formControlClassName: PropTypes.string,
    lines: PropTypes.number,
    children: PropTypes.node,
    codeMirrorOptions: PropTypes.shape({}),
    editorWrapperClassName: PropTypes.string,
    extraNavControls: PropTypes.node,
  }

  static defaultProps = {
    className: null,
    formControlClassName: null,
    lines: null,
    children: null,
    onBlur: null,
    codeMirrorOptions: {},
    editorWrapperClassName: null,
    extraNavControls: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      previewing: false,
    };
  }

  onBeforeChange = (editor, data, value) => {
    this.props.onChange(value);
    this.setState({ previewContent: null });
  }

  editTabClicked = (event) => {
    event.preventDefault();
    this.setState({ previewing: false });
  }

  previewTabClicked = (event) => {
    event.preventDefault();
    this.setState({ previewing: true });

    if (this.state.previewContent == null) {
      this.setState({ previewContent: <LoadingIndicator /> });

      this.props.getPreviewContent(this.props.value).then((html) => {
        this.setState({
          previewContent: (
            <div dangerouslySetInnerHTML={{ __html: html }} />
          ),
        });
      }).catch(({ error }) => {
        this.setState({
          previewContent: (
            <ErrorDisplay graphQLError={error} />
          ),
        });
      });
    }
  }

  renderPreviewContent = () => (
    <div className="markdown-preview">
      {this.state.previewContent}
    </div>
  )

  renderContent = () => {
    if (this.state.previewing) {
      return this.renderPreviewContent();
    }

    // react-codemirror2 doesn't want event handlers to be passed undefined
    const eventHandlers = {};
    if (this.props.onBlur) {
      eventHandlers.onBlur = this.props.onBlur;
    }

    return (
      <CodeMirror
        value={this.props.value}
        options={{
          ...defaultCodeMirrorOptions,
          lineNumbers: false,
          foldGutter: false,
          gutters: [],
          mode: this.props.mode,
          ...(this.props.codeMirrorOptions || {}),
        }}
        {...eventHandlers}
        onBeforeChange={this.onBeforeChange}
      />
    );
  }

  render = () => (
    <div className={this.props.className}>
      <div
        className={classNames(
          `form-control p-0 codemirror-height-${this.props.lines || 10}`,
          this.props.formControlClassName,
        )}
        style={{ overflow: 'hidden' }}
      >
        <ul className="nav nav-pills bg-light p-1">
          <li className="nav-item">
            <a
              href="#"
              className={classNames('nav-link py-0 px-2', { active: !this.state.previewing })}
              onClick={this.editTabClicked}
            >
              Edit
            </a>
          </li>
          <li className="nav-item">
            <a
              href="#"
              className={classNames('nav-link py-0 px-2', { active: this.state.previewing })}
              onClick={this.previewTabClicked}
            >
              Preview
            </a>
          </li>
          {this.props.extraNavControls}
        </ul>
        <div className={classNames('form-control border-0', this.props.editorWrapperClassName)}>
          {this.renderContent()}
        </div>
      </div>
      {this.props.children}
    </div>
  )
}

export default CodeInput;
