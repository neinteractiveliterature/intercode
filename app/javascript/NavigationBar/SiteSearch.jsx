import React, {
  useCallback, useEffect, useRef, useState, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { components } from 'react-select';
import AsyncSelect from 'react-select/async';
import debounce from 'debounce-promise';
import { useHistory } from 'react-router-dom';
import { useApolloClient } from '@apollo/react-hooks';
import { CSSTransition } from 'react-transition-group';
import {
  Search, ExactWordIndexStrategy, StemmingTokenizer, SimpleTokenizer,
} from 'js-search';
import { stemmer } from 'porter-stemmer';
import { v4 as uuidv4 } from 'uuid';

import buildEventUrl from '../EventsApp/buildEventUrl';
import { SiteSearchQuery } from './siteSearchQueries.gql';
import { useAdminNavigationItems } from './AdminNavigationSection';
import { useEventsNavigationItems } from './EventsNavigationSection';

function getSearchableModelIcon(model) {
  if (model.__typename === 'NavigationItem') {
    return model.icon || 'fa-file-text-o';
  }

  if (model.__typename === 'Page') {
    return 'fa-file-text-o';
  }

  if (model.__typename === 'Event') {
    return 'fa-ticket';
  }

  if (model.__typename === 'UserConProfile') {
    return 'fa-user-circle';
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

function SiteSearch({ visible, setVisible, visibilityChangeComplete }) {
  const history = useHistory();
  const apolloClient = useApolloClient();
  const selectRef = useRef();
  const [inputValue, setInputValue] = useState('');
  const [value, setValue] = useState(null);
  const adminNavigationItems = useAdminNavigationItems();
  const eventsNavigationItems = useEventsNavigationItems();

  const navigationItemsWithId = useMemo(
    () => [...adminNavigationItems, ...eventsNavigationItems].map((item) => ({
      id: uuidv4(),
      ...item,
    })),
    [adminNavigationItems, eventsNavigationItems],
  );

  const navigationItemsSearchIndex = useMemo(
    () => {
      const search = new Search('id');
      search.indexStrategy = new ExactWordIndexStrategy();
      search.tokenizer = new StemmingTokenizer(stemmer, new SimpleTokenizer());
      search.addIndex('label');
      search.addDocuments(navigationItemsWithId);
      return search;
    },
    [navigationItemsWithId],
  );

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

  const close = useCallback(
    () => {
      setVisible(false);
      setInputValue('');
      setValue(null);
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
        const navigationItemsResult = navigationItemsSearchIndex.search(query);
        return [
          ...navigationItemsResult.map((navigationItem) => ({
            title: navigationItem.label,
            highlight: '',
            model: {
              __typename: 'NavigationItem',
              ...navigationItem,
            },
          })),
          ...data.siteSearch.entries,
        ];
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
      } else if (model.__typename === 'NavigationItem') {
        history.push(model.url);
      } else if (model.__typename === 'UserConProfile') {
        history.push(`/user_con_profiles/${model.id}`);
      }
      close();
    },
    [close, history],
  );

  const focusSelect = useCallback(
    () => {
      if (selectRef.current) {
        selectRef.current.focus();
      }
    },
    [],
  );

  const entered = useCallback(
    () => {
      focusSelect();
      visibilityChangeComplete(true);
    },
    [focusSelect, visibilityChangeComplete],
  );

  const exited = useCallback(
    () => {
      visibilityChangeComplete(false);
    },
    [visibilityChangeComplete],
  );

  return (
    <CSSTransition timeout={400} in={visible} classNames="site-search" onEntered={entered} onExited={exited}>
      <AsyncSelect
        ref={selectRef}
        placeholder=""
        className="site-search"
        inputValue={inputValue}
        value={value}
        onInputChange={(newInputValue) => {
          if (visible) {
            setInputValue(newInputValue);
          }
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            close();
          }
        }}
        styles={{
          control: (baseProps) => ({
            ...baseProps,
            borderRadius: baseProps.minHeight / 2,
            paddingLeft: baseProps.minHeight / 6,
          }),
          indicatorSeparator: () => { },
          indicatorsContainer: (baseProps) => ({
            ...baseProps,
            position: 'absolute',
            right: '2px',
          }),
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
                overflow: 'hidden',
              }}
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: entry.highlight }}
            />
          </>
        )}
      />
    </CSSTransition>
  );
}

SiteSearch.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  visibilityChangeComplete: PropTypes.func.isRequired,
};

export default SiteSearch;
