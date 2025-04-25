import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { components, DropdownIndicatorProps, GroupBase, MenuProps } from 'react-select';
import AsyncSelect from 'react-select/async';
import debounce from 'debounce-promise';
import { useNavigate } from 'react-router';
import { CSSTransition } from 'react-transition-group';
import { Search, ExactWordIndexStrategy, StemmingTokenizer, SimpleTokenizer } from 'js-search';
import { stemmer } from 'porter-stemmer';
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next';

import buildEventUrl from '../EventsApp/buildEventUrl';
import { SiteSearchQueryDocument, SiteSearchQueryData } from './siteSearchQueries.generated';
import { useAdminNavigationItems } from './AdminNavigationSection';
import { useEventsNavigationItems } from './EventsNavigationSection';
import { GeneratedNavigationItem } from './GeneratedNavigationSection';
import { SelectInstance } from 'react-select';
import { client } from '../useIntercodeApolloClient';
import searchStyles from 'styles/search.module.scss';

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
    // eslint-disable-next-line i18next/no-literal-string
    return model.icon ?? 'bi-file-earmark-text';
  }

  if (model.__typename === 'Page') {
    // eslint-disable-next-line i18next/no-literal-string
    return 'bi-file-earmark-text';
  }

  if (model.__typename === 'Event') {
    // eslint-disable-next-line i18next/no-literal-string
    return 'bi-calendar';
  }

  if (model.__typename === 'UserConProfile') {
    // eslint-disable-next-line i18next/no-literal-string
    return 'bi-person-circle';
  }

  if (model.__typename === 'EventProposal') {
    // eslint-disable-next-line i18next/no-literal-string
    return 'bi-gift-fill';
  }

  // eslint-disable-next-line i18next/no-literal-string
  return 'bi-square-fill';
}

function SearchDropdownIndicator(
  props: DropdownIndicatorProps<SiteSearchOptionType, false, GroupBase<SiteSearchOptionType>>,
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
          <>
            <i className="bi-lightbulb" /> {t('navigation.search.searchAnywhereText')}{' '}
            <span className="bg-white font-monospace border rounded px-1">
              {t('navigation.search.searchAnywhereKeyCombo')}
            </span>
          </>
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

function SiteSearch({ visible, setVisible, visibilityChangeComplete }: SiteSearchProps): JSX.Element {
  const navigate = useNavigate();
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
          const { data } = await client.query({ query: SiteSearchQueryDocument, variables: { query } });
          const navigationItemsResult = (navigationItemsSearchIndex.search(query) as typeof navigationItemsWithId).map(
            (navigationItem) => ({
              title: navigationItem.label,
              highlight: '',
              model: {
                __typename: 'NavigationItem',
                ...navigationItem,
              },
            }),
          );
          return [...navigationItemsResult, ...data.cmsParent.fullTextSearch.entries] as SiteSearchOptionType[];
        },
        200,
        { leading: false },
      ),
    [navigationItemsSearchIndex],
  );

  const selectRef = useRef<SelectInstance<SiteSearchOptionType>>(null);

  const keyDownListener = useCallback(
    (event: KeyboardEvent) => {
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
        navigate(`/pages/${(model as { slug: string }).slug}`);
      } else if (model.__typename === 'Event') {
        navigate(buildEventUrl(model));
      } else if (model.__typename === 'NavigationItem') {
        navigate(model.url);
      } else if (model.__typename === 'UserConProfile') {
        navigate(`/user_con_profiles/${model.id}`);
      } else if (model.__typename === 'EventProposal') {
        navigate(`/admin_event_proposals/${model.id}`);
      }
      close();
    },
    [close, navigate],
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
      classNames={{
        enterActive: searchStyles.siteSearchEnterActive,
        enterDone: searchStyles.siteSearchEnterDone,
        exitActive: searchStyles.siteSearchExitActive,
        exitDone: searchStyles.siteSearchExitDone,
      }}
      onEntered={entered}
      onExited={exited}
    >
      <AsyncSelect<SiteSearchOptionType>
        ref={selectRef}
        placeholder=""
        className={`site-search ${searchStyles.siteSearch}`}
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
              dangerouslySetInnerHTML={{ __html: entry.highlight ?? '' }}
            />
          </>
        )}
      />
    </CSSTransition>
  );
}

export default SiteSearch;
