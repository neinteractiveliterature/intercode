import React from 'react';
import PropTypes from 'prop-types';

import CombinedReactTableConsumer from './CombinedReactTableConsumer';
import { ColumnSelectionConsumer } from './ColumnSelectionContext';
import ColumnSelector from './ColumnSelector';
import ExportButton from './ExportButton';

class TableHeader extends React.PureComponent {
  static propTypes = {
    consumers: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    exportUrl: PropTypes.string.isRequired,
    getPossibleColumns: PropTypes.func.isRequired,
    renderLeftContent: PropTypes.func,
    renderRightContent: PropTypes.func,
  }

  static defaultProps = {
    renderLeftContent: null,
    renderRightContent: null,
  }

  render = () => {
    const {
      consumers, exportUrl, getPossibleColumns, renderLeftContent, renderRightContent,
    } = this.props;

    return (
      <CombinedReactTableConsumer consumers={consumers}>
        {({
          filtered, sorted, loading, data,
        }) => (
          <div className="d-flex">
            <div className="flex-grow-1">
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
              {(renderLeftContent || (() => null))()}
            </div>
            <div>
              {(renderRightContent || (() => null))()}
              <ColumnSelector
                getPossibleColumns={() => (loading ? [] : getPossibleColumns(data))}
              />
            </div>
          </div>
        )}
      </CombinedReactTableConsumer>
    );
  }
}

export default TableHeader;
