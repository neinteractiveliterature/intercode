import React from 'react';
import PropTypes from 'prop-types';

import { ColumnSelectionConsumer, ColumnSelectionProvider } from './ColumnSelectionContext';
import ColumnSelector from './ColumnSelector';
import CombinedReactTableConsumer from './CombinedReactTableConsumer';
import ExportButton from './ExportButton';
import { GraphQLReactTableConsumer, GraphQLReactTableProvider } from './GraphQLReactTableContext';
import { ReactRouterReactTableConsumer, ReactRouterReactTableProvider } from './ReactRouterReactTableContext';
import ReactTableWithContexts from './ReactTableWithContexts';

class ReactTableWithTheWorks extends React.PureComponent {
  static propTypes = {
    decodeFilterValue: PropTypes.func,
    defaultVisibleColumns: PropTypes.arrayOf(PropTypes.string.isRequired),
    encodeFilterValue: PropTypes.func,
    exportUrl: PropTypes.string.isRequired,
    getData: PropTypes.func.isRequired,
    getPages: PropTypes.func.isRequired,
    getPossibleColumns: PropTypes.func.isRequired,
    query: PropTypes.any.isRequired,
    variables: PropTypes.shape({}),
  };

  static defaultProps = {
    decodeFilterValue: null,
    defaultVisibleColumns: null,
    encodeFilterValue: null,
    variables: null,
  };

  render = () => {
    const {
      decodeFilterValue,
      defaultVisibleColumns,
      encodeFilterValue,
      exportUrl,
      getData,
      getPages,
      getPossibleColumns,
      query,
      variables,
      ...otherProps
    } = this.props;

    return (
      <ReactRouterReactTableProvider
        decodeFilterValue={decodeFilterValue}
        encodeFilterValue={encodeFilterValue}
      >
        <GraphQLReactTableProvider
          getData={getData}
          getPages={getPages}
          query={query}
          variables={variables}
        >
          <GraphQLReactTableConsumer>
            {({ queryResult: { data, loading } }) => (
              <ColumnSelectionProvider
                getPossibleColumns={() => getPossibleColumns(data)}
                defaultVisibleColumns={defaultVisibleColumns}
              >
                <div>
                  <div className="d-flex">
                    <div className="flex-grow-1">
                      <CombinedReactTableConsumer
                        consumers={[ReactRouterReactTableConsumer]}
                      >
                        {({ filtered, sorted }) => (
                          <ColumnSelectionConsumer>
                            {({ getVisibleColumnIds }) => (
                              <ExportButton
                                exportUrl={exportUrl}
                                filtered={filtered}
                                sorted={sorted}
                                columns={getVisibleColumnIds()}
                              />
                            )}
                          </ColumnSelectionConsumer>
                        )}
                      </CombinedReactTableConsumer>
                    </div>
                    <div>
                      <ColumnSelector getPossibleColumns={() => (loading ? [] : getPossibleColumns(data))} />
                    </div>
                  </div>
                  <ReactTableWithContexts
                    consumers={[
                      ReactRouterReactTableConsumer,
                      GraphQLReactTableConsumer,
                      ColumnSelectionConsumer,
                    ]}
                    {...otherProps}
                  />
                </div>
              </ColumnSelectionProvider>
            )}
          </GraphQLReactTableConsumer>
        </GraphQLReactTableProvider>
      </ReactRouterReactTableProvider>
    );
  }
}

export default ReactTableWithTheWorks;
