import React from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { Controlled as CodeMirror } from 'react-codemirror2';
import classNames from 'classnames';
import defaultCodeMirrorOptions from '../defaultCodeMirrorOptions';
import ErrorDisplay from '../ErrorDisplay';
import LoadingIndicator from '../LoadingIndicator';

const previewMarkdownQuery = gql`
query($markdown: String!) {
  previewMarkdown(markdown: $markdown)
}
`;

@withApollo
class MarkdownInput extends React.Component {
  static propTypes = {
    client: PropTypes.shape({
      query: PropTypes.func.isRequired,
    }).isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  }

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
      this.props.client.query({
        query: previewMarkdownQuery,
        variables: { markdown: this.props.value },
      }).then(({ data }) => {
        this.setState({
          previewContent: (
            <div
              className="form-control border-0"
              dangerouslySetInnerHTML={{ __html: data.previewMarkdown }}
            />
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

    return (
      <div className="form-control border-0">
        <CodeMirror
          value={this.props.value}
          options={{
            ...defaultCodeMirrorOptions,
            lineNumbers: false,
            foldGutter: false,
            gutters: [],
            mode: 'liquid-markdown',
          }}
          onBeforeChange={this.onBeforeChange}
        />
      </div>
    );
  }

  render = () => (
    <div>
      <div className="form-control p-0">
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
        </ul>
        {this.renderContent()}
      </div>
    </div>
  )
}

export default MarkdownInput;
