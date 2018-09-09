import React from 'react';
import PropTypes from 'prop-types';

import { ColumnSelectionConsumer, ColumnSelectionProvider } from './ColumnSelectionContext';
import { GraphQLReactTableConsumer, GraphQLReactTableProvider } from './GraphQLReactTableContext';
import { ReactRouterReactTableConsumer, ReactRouterReactTableProvider } from './ReactRouterReactTableContext';
import ReactTableWithContexts from './ReactTableWithContexts';
import TableHeader from './TableHeader';

class ReactTableWithTheWorks extends React.PureComponent {
  static propTypes = {
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
    variables: PropTypes.shape({}),
  };

  static defaultProps = {
    decodeFilterValue: null,
    defaultVisibleColumns: null,
    encodeFilterValue: null,
    renderHeader: null,
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
      renderFooter: propRenderFooter,
      renderHeader: propRenderHeader,
      variables,
      ...otherProps
    } = this.props;

    const consumers = [
      ReactRouterReactTableConsumer,
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
        <GraphQLReactTableProvider
          getData={getData}
          getPages={getPages}
          query={query}
          variables={variables}
        >
          <GraphQLReactTableConsumer>
            {({ queryResult: { data } }) => (
              <ColumnSelectionProvider
                getPossibleColumns={() => getPossibleColumns(data)}
                defaultVisibleColumns={defaultVisibleColumns}
              >
                <div>
                  {renderHeader({ consumers, exportUrl, getPossibleColumns })}
                  <ReactTableWithContexts
                    consumers={[
                      ReactRouterReactTableConsumer,
                      GraphQLReactTableConsumer,
                      ColumnSelectionConsumer,
                    ]}
                    {...otherProps}
                  />
                  {renderFooter()}
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
