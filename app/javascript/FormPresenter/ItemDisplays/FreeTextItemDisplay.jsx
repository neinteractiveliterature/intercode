import React from 'react';
import PropTypes from 'prop-types';

import PlainTextDisplay from '../../PlainTextDisplay';
import { PreviewMarkdownQuery } from '../../BuiltInFormControls/previewQueries.gql';
import QueryWithStateDisplay from '../../QueryWithStateDisplay';

function parseURL(value) {
  try {
    return new URL(value);
  } catch (error) {
    try {
      return new URL(`http://${value}`);
    } catch (error2) {
      return null;
    }
  }
}

class FreeTextItemDisplay extends React.PureComponent {
  static propTypes = {
    formItem: PropTypes.shape({
      identifier: PropTypes.string.isRequired,
      properties: PropTypes.shape({
        caption: PropTypes.string.isRequired,
        format: PropTypes.string,
      }).isRequired,
    }).isRequired,
    value: PropTypes.string,
  };

  static defaultProps = {
    value: null,
  };

  render = () => {
    const { formItem, value } = this.props;
    if (formItem.properties.format === 'markdown') {
      return (
        <QueryWithStateDisplay query={PreviewMarkdownQuery} variables={{ markdown: value }}>
          {({ data }) => (
            // eslint-disable-next-line react/no-danger
            <span dangerouslySetInnerHTML={{ __html: data.previewMarkdown }} />
          )}
        </QueryWithStateDisplay>
      );
    }

    if (formItem.properties.format === 'url') {
      try {
        const url = parseURL(value);
        return (<a href={url.toString()}>{url.toString()}</a>);
      } catch {
        // fall through to displaying as plain text
      }
    }

    return <PlainTextDisplay value={value} />;
  };
}

export default FreeTextItemDisplay;
