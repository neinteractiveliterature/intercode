import React from 'react';
import { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';
import CodeInput from './CodeInput';

const previewLiquidQuery = gql`
query($liquid: String!) {
  previewLiquid(content: $liquid)
}
`;

class LiquidInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showingDocs: false,
    };
  }

  renderDocs = () => {
    if (!this.state.showingDocs) {
      return null;
    }

    return (
      <React.Fragment>
        <div className="liquid-docs-browser d-flex flex-column align-items-stretch">
          <header className="bg-dark border-top border-color-light d-flex align-items-center">
            <div className="font-weight-bold text-white flex-grow-1 ml-2 pt-1 text-center">
              Liquid markup documentation
            </div>
            <div>
              <button
                type="button"
                className="btn btn-link btn-sm mr-3 text-white"
                style={{ cursor: 'pointer' }}
                onClick={() => { this.setState({ showingDocs: false }); }}
              >
                <i className="fa fa-close" title="Close" />
              </button>
            </div>
          </header>
          <iframe
            src="/liquid_docs"
            title="Liquid markup documentation"
            className="flex-grow-1 border-0"
          />
        </div>
        <div className="liquid-docs-spacer" />
      </React.Fragment>
    );
  }

  render = () => (
    <ApolloConsumer>
      {client => (
        <CodeInput
          {...this.props}
          mode="liquid-html"
          getPreviewContent={async (liquid) => {
            const response = await client.query({
              query: previewLiquidQuery,
              variables: { liquid },
            });

            return response.data.previewLiquid;
          }}
          extraNavControls={(
            <li className="flex-grow-1 text-right">
              <div className="nav-item">
                <a
                  href="#"
                  className="nav-link py-0 px-2"
                  onClick={(e) => { e.preventDefault(); this.setState({ showingDocs: true }); }}
                >
                  <i className="fa fa-question-circle" />
                  {' '}
                  Help
                </a>
              </div>
            </li>
          )}
        >
          {this.renderDocs()}
        </CodeInput>
      )}
    </ApolloConsumer>
  )
}

export default LiquidInput;
