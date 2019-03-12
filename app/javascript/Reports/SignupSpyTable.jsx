import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import ReactTableWithTheWorks from '../Tables/ReactTableWithTheWorks';
import { SignupSpySignupsQuery } from './queries.gql';
import TableHeader from '../Tables/TableHeader';

const ReactTableInstanceContext = React.createContext({ instance: null });

class SignupSpyTable extends React.Component {
  static propTypes = {
    basename: PropTypes.string.isRequired,
    exportUrl: PropTypes.string.isRequired,
  };

  getPossibleColumns = data => [
    {
      Header: 'Name',
      id: 'name',
      accessor: signup => signup.user_con_profile.name_inverted,
      sortable: false,
      filterable: false,
    },
    {
      Header: 'Event',
      id: 'event_title',
      accessor: signup => signup.run.event.title,
      sortable: false,
      filterable: false,
    },
    {
      Header: 'State',
      id: 'state',
      accessor: 'state',
      width: 130,
      filterable: false,
      sortable: false,
      Cell: props => (
        <div className={`badge bg-signup-state-color-${props.value}`}>
          {props.value}
        </div>
      ),
    },
    {
      Header: 'Timestamp',
      id: 'created_at',
      accessor: 'created_at',
      sortable: false,
      filterable: false,
      Cell: props => moment.tz(props.value, data.convention.timezone_name).format('MMM D, YYYY [at] h:mm:ssa'),
    },
    {
      Header: 'Choice',
      id: 'choice',
      width: 100,
      accessor: 'choice',
      sortable: false,
      filterable: false,
      Cell: (props) => {
        if (props.original.counted) {
          return props.value;
        }

        return 'N/C';
      },
    },
  ];

  render = () => (
    <div className="mb-4">
      <BrowserRouter basename={this.props.basename}>
        <Switch>
          <Route
            path="/"
            exact
            render={() => (
              <ReactTableWithTheWorks
                defaultVisibleColumns={['name', 'event_title', 'state', 'created_at', 'choice']}
                exportUrl={this.props.exportUrl}
                getData={({ data }) => data.convention.signup_spy_paginated.entries}
                getPages={({ data }) => data.convention.signup_spy_paginated.total_pages}
                getPossibleColumns={this.getPossibleColumns}
                query={SignupSpySignupsQuery}
                storageKeyPrefix="signupSpy"
                className="-striped -highlight"
                renderHeader={headerProps => (
                  <TableHeader
                    {...headerProps}
                    renderLeftContent={() => (
                      <ReactTableInstanceContext.Consumer>
                        {instance => (
                          <button className="btn btn-link mb-2 ml-2" type="button" onClick={instance.fireFetchData}>
                            <i className="fa fa-refresh" />
                            {' '}
                            Refresh
                          </button>
                        )}
                      </ReactTableInstanceContext.Consumer>
                    )}
                  />
                )}
              >
                {({
                  makeTable,
                  instance,
                  renderHeader,
                  renderFooter,
                }) => (
                  <ReactTableInstanceContext.Provider value={instance}>
                    {renderHeader()}
                    {makeTable()}
                    {renderFooter()}
                  </ReactTableInstanceContext.Provider>
                )}
              </ReactTableWithTheWorks>
            )}
          />
        </Switch>
      </BrowserRouter>
    </div>
  )
}

export default SignupSpyTable;
