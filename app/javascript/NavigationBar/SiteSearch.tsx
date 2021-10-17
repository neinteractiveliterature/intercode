import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { components, GroupTypeBase, IndicatorProps, MenuProps } from 'react-select';
import AsyncSelect from 'react-select/async';
import debounce from 'debounce-promise';
import { useHistory } from 'react-router-dom';
import { useApolloClient } from '@apollo/client';
import { CSSTransition } from 'react-transition-group';
import { Search, ExactWordIndexStrategy, StemmingTokenizer, SimpleTokenizer } from 'js-search';
// @ts-expect-error porter-stemmer has no types
import { stemmer } from 'porter-stemmer';
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next';

import buildEventUrl from '../EventsApp/buildEventUrl';
import {
  SiteSearchQueryDocument,
  SiteSearchQueryData,
  SiteSearchQueryVariables,
} from './siteSearchQueries.generated';
import { useAdminNavigationItems } from './AdminNavigationSection';
import { useEventsNavigationItems } from './EventsNavigationSection';
import { GeneratedNavigationItem } from './GeneratedNavigationSection';

type NavigationItemSearchDocument = GeneratedNavigationItem & {
  id: string;
};

type NavigationItemSearchResult = {
  title: string;
  highlight: '';
  model: NavigationItemSearchDocument & {
    __typename: 'NavigationItem';
  };
};

type SiteSearchOptionType =
  | NavigationItemSearchResult
  | SiteSearchQueryData['cmsParent']['fullTextSearch']['entries'][number];

function getSearchableModelIcon(model: { __typename: string; icon?: string }) {
  if (model.__typename === 'NavigationItem') {
    return model.icon ?? 'bi-file-earmark-text';
  }

  if (model.__typename === 'Page') {
    return 'bi-file-earmark-text';
  }

  if (model.__typename === 'Event') {
    return 'bi-calendar';
  }

  if (model.__typename === 'UserConProfile') {
    return 'bi-person-circle';
  }

  if (model.__typename === 'EventProposal') {
    return 'bi-gift-fill';
  }

  return 'bi-square-fill';
}

function SearchDropdownIndicator(
  props: IndicatorProps<SiteSearchOptionType, false, GroupTypeBase<SiteSearchOptionType>>,
) {
  return (
    <components.DropdownIndicator {...props}>
      <i className="bi-search" />
    </components.DropdownIndicator>
  );
}

function SearchMenu(props: MenuProps<SiteSearchOptionType, false>) {
  const { t } = useTranslation();

  return (
    <components.Menu {...props}>
      <>
        {props.children}
        <div className="bg-light small p-1 text-muted d-none d-md-block">
          <i className="bi-lightbulb" />{' '}
          {t('navigation.search.searchAnywhereText', 'Search anywhere:')}{' '}
          <span className="bg-white font-monospace border rounded px-1">
            {t('navigation.search.searchAnywhereKeyCombo', 'Ctrl-/')}
          </span>
        </div>
      </>
    </components.Menu>
  );
}

export type SiteSearchProps = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  visibilityChangeComplete: (visible: boolean) => void;
};

function SiteSearch({
  visible,
  setVisible,
  visibilityChangeComplete,
}: SiteSearchProps): JSX.Element {
  const history = useHistory();
  const apolloClient = useApolloClient();
  const [inputValue, setInputValue] = useState('');
  const [value, setValue] = useState(null);
  const adminNavigationItems = useAdminNavigationItems();
  const eventsNavigationItems = useEventsNavigationItems();

  const navigationItemsWithId = useMemo(
    () =>
      [...adminNavigationItems, ...eventsNavigationItems].map((item) => ({
        id: uuidv4(),
        ...item,
      })),
    [adminNavigationItems, eventsNavigationItems],
  );

  const navigationItemsSearchIndex = useMemo(() => {
    const search = new Search('id');
    search.indexStrategy = new ExactWordIndexStrategy();
    search.tokenizer = new StemmingTokenizer(stemmer, new SimpleTokenizer());
    search.addIndex('label');
    search.addDocuments(navigationItemsWithId);
    return search;
  }, [navigationItemsWithId]);

  const loadOptions = useMemo(
    () =>
      debounce(
        async (query: string) => {
          const { data } = await apolloClient.query<SiteSearchQueryData, SiteSearchQueryVariables>({
            query: SiteSearchQueryDocument,
            variables: { query },
            fetchPolicy: 'no-cache',
          });
          const navigationItemsResult = (
            navigationItemsSearchIndex.search(query) as typeof navigationItemsWithId
          ).map((navigationItem) => ({
            title: navigationItem.label,
            highlight: '',
            model: {
              __typename: 'NavigationItem',
              ...navigationItem,
            },
          }));
          return [
            ...navigationItemsResult,
            ...data.cmsParent.fullTextSearch.entries,
          ] as SiteSearchOptionType[];
        },
        200,
        { leading: false },
      ),
    [apolloClient, navigationItemsSearchIndex],
  );

  const selectRef = useRef<AsyncSelect<SiteSearchOptionType>>(null);

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

  const close = useCallback(() => {
    setVisible(false);
    setInputValue('');
    setValue(null);
  }, [setVisible]);

  useEffect(() => {
    document.addEventListener('keydown', keyDownListener, { capture: true });
    return () => document.removeEventListener('keydown', keyDownListener, { capture: true });
  }, [keyDownListener]);

  const optionSelected = useCallback(
    (entry: SiteSearchOptionType) => {
      const { model } = entry;
      if (model.__typename === 'Page') {
        history.push(`/pages/${(model as { slug: string }).slug}`);
      } else if (model.__typename === 'Event') {
        history.push(buildEventUrl(model));
      } else if (model.__typename === 'NavigationItem') {
        history.push(model.url);
      } else if (model.__typename === 'UserConProfile') {
        history.push(`/user_con_profiles/${model.id}`);
      } else if (model.__typename === 'EventProposal') {
        history.push(`/admin_event_proposals/${model.id}`);
      }
      close();
    },
    [close, history],
  );

  const focusSelect = useCallback(() => {
    if (selectRef.current) {
      selectRef.current.focus();
    }
  }, []);

  const entered = useCallback(() => {
    focusSelect();
    visibilityChangeComplete(true);
  }, [focusSelect, visibilityChangeComplete]);

  const exited = useCallback(() => {
    visibilityChangeComplete(false);
  }, [visibilityChangeComplete]);

  return (
    <CSSTransition
      timeout={400}
      in={visible}
      classNames="site-search"
      onEntered={entered}
      onExited={exited}
    >
      <AsyncSelect<SiteSearchOptionType>
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
            borderRadius: (baseProps.minHeight as number) / 2,
            paddingLeft: (baseProps.minHeight as number) / 6,
          }),
          indicatorSeparator: () => ({}),
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
        formatOptionLabel={(entry: SiteSearchOptionType) => (
          <>
            <div className="fw-bold mb-1">
              <i className={getSearchableModelIcon(entry.model)} /> {entry.title}
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
              dangerouslySetInnerHTML={{ __html: entry.highlight ?? '' }}
            />
          </>
        )}
      />
    </CSSTransition>
  );
}

export default SiteSearch;
