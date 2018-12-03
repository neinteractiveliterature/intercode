import React from 'react';
import PropTypes from 'prop-types';

import { ColumnSelectionConsumer, ColumnSelectionProvider } from './ColumnSelectionContext';
import { GraphQLReactTableConsumer, GraphQLReactTableProvider } from './GraphQLReactTableContext';
import { LocalStorageReactTableConsumer, LocalStorageReactTableProvider } from './LocalStorageReactTableContext';
import { ReactRouterReactTableConsumer, ReactRouterReactTableProvider } from './ReactRouterReactTableContext';
import ReactTableWithContexts from './ReactTableWithContexts';
import TableHeader from './TableHeader';

class ReactTableWithTheWorks extends React.PureComponent {
  static propTypes = {
    alwaysVisibleColumns: PropTypes.arrayOf(PropTypes.string.isRequired),
    children: PropTypes.func,
    decodeFilterValue: PropTypes.func,
    defaultVisibleColumns: PropTypes.arrayOf(PropTypes.string.isRequired),
    encodeFilterValue: PropTypes.func,
    exportUrl: PropTypes.string.isRequired,
    getData: PropTypes.func.isRequired,
    getPages: PropTypes.func.isRequired,
    getPossibleColumns: PropTypes.func.isRequired,
    query: PropTypes.shape({}).isRequired,
    renderHeader: PropTypes.func,
    renderFooter: PropTypes.func,
    storageKeyPrefix: PropTypes.string.isRequired,
    variables: PropTypes.shape({}),
  };

  static defaultProps = {
    alwaysVisibleColumns: null,
    children: null,
    decodeFilterValue: null,
    defaultVisibleColumns: null,
    encodeFilterValue: null,
    renderFooter: null,
    renderHeader: null,
    variables: null,
  };

  render = () => {
    const {
      alwaysVisibleColumns,
      children,
      decodeFilterValue,
      defaultVisibleColumns,
      encodeFilterValue,
      exportUrl,
      getData,
      getPages,
      getPossibleColumns,
      query,
      renderFooter: propRenderFooter,
      renderHeader: propRenderHeader,
      variables,
      ...otherProps
    } = this.props;

    const consumers = [
      ReactRouterReactTableConsumer,
      LocalStorageReactTableConsumer,
      GraphQLReactTableConsumer,
      ColumnSelectionConsumer,
    ];

    const renderHeader = propRenderHeader || (headerProps => (
      <TableHeader {...headerProps} />
    ));

    const renderFooter = propRenderFooter || (() => null);

    return (
      <ReactRouterReactTableProvider
        decodeFilterValue={decodeFilterValue}
        encodeFilterValue={encodeFilterValue}
      >
        <LocalStorageReactTableProvider storageKeyPrefix={this.props.storageKeyPrefix}>
          <GraphQLReactTableProvider
            getData={getData}
            getPages={getPages}
            query={query}
            variables={variables}
          >
            <GraphQLReactTableConsumer>
              {({ queryResult: { data } }) => (
                <ColumnSelectionProvider
                  alwaysVisibleColumns={alwaysVisibleColumns}
                  getPossibleColumns={() => getPossibleColumns(data)}
                  defaultVisibleColumns={defaultVisibleColumns}
                >
                  <ReactTableWithContexts
                    consumers={consumers}
                    {...otherProps}
                  >
                    {(state, makeTable, instance) => (
                      children
                        ? children({
                          tableState: state,
                          makeTable,
                          instance,
                          renderFooter,
                          renderHeader: () => (
                            renderHeader({ consumers, exportUrl, getPossibleColumns })
                          ),
                        })
                        : (
                          <React.Fragment>
                            {renderHeader({ consumers, exportUrl, getPossibleColumns })}
                            {makeTable()}
                            {renderFooter()}
                          </React.Fragment>
                        )
                    )}
                  </ReactTableWithContexts>
                </ColumnSelectionProvider>
              )}
            </GraphQLReactTableConsumer>
          </GraphQLReactTableProvider>
        </LocalStorageReactTableProvider>
      </ReactRouterReactTableProvider>
    );
  }
}

export default ReactTableWithTheWorks;
