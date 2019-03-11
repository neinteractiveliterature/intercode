import React from 'react';
import { ApolloConsumer } from 'react-apollo';
import classNames from 'classnames';

import CodeInput from './CodeInput';
import { PreviewLiquidQuery } from './previewQueries.gql';

class LiquidInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showingDocs: false,
      currentDocTab: 'convention',
    };
  }

  docTabClicked = (event, tab) => {
    event.preventDefault();
    this.setState({ currentDocTab: tab });
  }

  renderDocs = () => {
    if (!this.state.showingDocs) {
      return null;
    }

    return (
      <React.Fragment>
        <div className="liquid-docs-browser d-flex flex-column align-items-stretch">
          <header className="bg-light border-top border-color-light d-flex align-items-stretch">
            <div className="flex-grow-1 pt-1">
              <ul className="nav nav-tabs pl-2 justify-content-center">
                <li className="nav-item">
                  { /* eslint-disable-next-line jsx-a11y/anchor-is-valid */ }
                  <a
                    href="#"
                    className={classNames('nav-link', { active: this.state.currentDocTab === 'convention' })}
                    onClick={e => this.docTabClicked(e, 'convention')}
                  >
                    Convention-specific markup
                  </a>
                </li>
                <li className="nav-item">
                  { /* eslint-disable-next-line jsx-a11y/anchor-is-valid */ }
                  <a
                    href="#"
                    className={classNames('nav-link', { active: this.state.currentDocTab === 'core' })}
                    onClick={e => this.docTabClicked(e, 'core')}
                  >
                    Core Liquid markup
                  </a>
                </li>
              </ul>
            </div>
            <div className="border-bottom border-color-light d-flex align-items-center">
              <button
                type="button"
                className="btn btn-link btn-sm mr-3 text-body"
                style={{ cursor: 'pointer' }}
                onClick={() => { this.setState({ showingDocs: false }); }}
              >
                <i className="fa fa-close" title="Close" />
              </button>
            </div>
          </header>
          <iframe
            src={
              this.state.currentDocTab === 'convention'
                ? '/liquid_docs'
                : 'https://shopify.github.io/liquid/'
            }
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
              query: PreviewLiquidQuery,
              variables: { liquid },
              fetchPolicy: 'no-cache',
            });

            return response.data.previewLiquid;
          }}
          extraNavControls={(
            <li className="flex-grow-1 d-flex justify-content-end">
              <div className="nav-item">
                <button
                  type="button"
                  className="btn btn-link nav-link py-0 px-2"
                  onClick={(e) => { e.preventDefault(); this.setState({ showingDocs: true }); }}
                >
                  <i className="fa fa-question-circle" />
                  {' '}
                  Help
                </button>
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
