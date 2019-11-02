import React from 'react';
import PropTypes from 'prop-types';
import { Controlled as CodeMirror } from 'react-codemirror2';
import classNames from 'classnames';

import 'codemirror';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/mode/multiplex';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/matchtags';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/markdown-fold';
import 'codemirror/addon/fold/xml-fold';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/foldgutter.css';

import defaultCodeMirrorOptions from '../defaultCodeMirrorOptions';
import ErrorDisplay from '../ErrorDisplay';
import LoadingIndicator from '../LoadingIndicator';
import parsePageContent from '../parsePageContent';

import '../Codemirror/LiquidMultiplexModes';

class SyncCodeInput extends React.Component {
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

    if (!this.props.getPreviewContent) {
      return;
    }

    this.setState({ previewing: true });

    if (this.state.previewContent == null) {
      this.setState({ previewContent: <LoadingIndicator /> });

      this.props.getPreviewContent(this.props.value).then((html) => {
        this.setState({
          previewContent: parsePageContent(html).bodyComponents,
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
          readOnly: this.props.disabled ? 'nocursor' : false,
          ...(this.props.codeMirrorOptions || {}),
        }}
        {...eventHandlers}
        onBeforeChange={this.onBeforeChange}
      />
    );
  }

  renderNav = () => {
    if (!this.props.getPreviewContent && !this.props.extraNavControls) {
      return null;
    }

    return (
      <ul className="nav nav-pills bg-light p-1">
        <li className="nav-item">
          <button
            type="button"
            className={classNames('btn btn-link nav-link py-0 px-2', { active: !this.state.previewing })}
            onClick={this.editTabClicked}
          >
            Edit
          </button>
        </li>
        <li className="nav-item">
          <button
            type="button"
            className={classNames('btn btn-link nav-link py-0 px-2', { active: this.state.previewing })}
            onClick={this.previewTabClicked}
          >
            Preview
          </button>
        </li>
        {this.props.extraNavControls}
      </ul>
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
        {this.renderNav()}
        <div
          className={classNames(
            'form-control border-0',
            this.props.editorWrapperClassName,
            { 'bg-disabled': this.props.disabled },
          )}
        >
          {this.renderContent()}
        </div>
      </div>
      {this.props.children}
    </div>
  )
}

SyncCodeInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  getPreviewContent: PropTypes.func,
  mode: PropTypes.string.isRequired,
  onBlur: PropTypes.func,
  className: PropTypes.string,
  formControlClassName: PropTypes.string,
  lines: PropTypes.number,
  children: PropTypes.node,
  codeMirrorOptions: PropTypes.shape({}),
  editorWrapperClassName: PropTypes.string,
  extraNavControls: PropTypes.node,
  disabled: PropTypes.bool,
};

SyncCodeInput.defaultProps = {
  className: null,
  formControlClassName: null,
  lines: null,
  children: null,
  onBlur: null,
  codeMirrorOptions: {},
  editorWrapperClassName: null,
  extraNavControls: null,
  getPreviewContent: null,
  disabled: false,
};

export default SyncCodeInput;
