import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { components } from 'react-select';
import AsyncSelect from 'react-select/async';
import debounce from 'debounce-promise';
import { useHistory } from 'react-router-dom';
import { useApolloClient } from '@apollo/react-hooks';

import buildEventUrl from '../EventsApp/buildEventUrl';
import { SiteSearchQuery } from './siteSearchQueries.gql';

function getSearchableModelIcon(model) {
  if (model.__typename === 'Page') {
    return 'fa-file-text-o';
  }

  if (model.__typename === 'Event') {
    return 'fa-ticket';
  }

  return 'fa-square';
}

function SearchDropdownIndicator(props) {
  return (
    <components.DropdownIndicator {...props}>
      <i className="fa fa-search" />
    </components.DropdownIndicator>
  );
}

function SearchMenu(props) {
  return (
    <components.Menu {...props}>
      {props.children}
      <div className="bg-light small p-1 text-muted d-none d-md-block">
        <i className="fa fa-lightbulb-o" />
        {' '}
        Search anywhere:
        {' '}
        <span className="bg-white text-monospace border rounded px-1">Ctrl-/</span>
      </div>
    </components.Menu>
  );
}

SearchMenu.propTypes = {
  children: PropTypes.node,
};

SearchMenu.defaultProps = {
  children: null,
};

function SiteSearch({ visible, close, setVisible }) {
  const history = useHistory();
  const apolloClient = useApolloClient();

  const keyDownListener = useCallback(
    (event) => {
      if (event.key === '/' && event.ctrlKey) {
        event.stopPropagation();
        event.preventDefault();
        setVisible(true);
      }
    },
    [setVisible],
  );

  useEffect(
    () => {
      document.addEventListener('keydown', keyDownListener);
      return () => document.removeEventListener('keydown', keyDownListener);
    },
    [keyDownListener],
  );

  const loadOptions = useCallback(
    debounce(
      async (query) => {
        const { data } = await apolloClient.query({
          query: SiteSearchQuery, variables: { query }, fetchPolicy: 'no-cache',
        });
        return data.siteSearch.entries;
      },
      200,
      { leading: false },
    ),
    [apolloClient],
  );

  const optionSelected = useCallback(
    (entry) => {
      const { model } = entry;
      if (model.__typename === 'Page') {
        history.push(`/pages/${model.slug}`);
      } else if (model.__typename === 'Event') {
        history.push(buildEventUrl(model));
      }
      close();
    },
    [history, close],
  );

  if (!visible) {
    return <div />;
  }

  return (
    <AsyncSelect
      autoFocus
      placeholder="Search"
      className="site-search"
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          close();
        }
      }}
      styles={{
        container: (baseProps) => ({
          ...baseProps,
          flexGrow: 1,
        }),
        control: (baseProps) => ({
          ...baseProps,
          borderRadius: baseProps.minHeight / 2,
          paddingLeft: baseProps.minHeight / 6,
        }),
        indicatorSeparator: () => { },
      }}
      components={{
        DropdownIndicator: SearchDropdownIndicator,
        Menu: SearchMenu,
      }}
      loadOptions={loadOptions}
      onChange={optionSelected}
      onBlur={close}
      formatOptionLabel={(entry) => (
        <>
          <div className="font-weight-bold mb-1">
            <i className={`fa ${getSearchableModelIcon(entry.model)}`} />
            {' '}
            {entry.title}
          </div>
          <div
            className="small"
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
              overflow: 'hidden'
            }}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: entry.highlight }}
          />
        </>
      )}
    />
  );
}

export default SiteSearch;
