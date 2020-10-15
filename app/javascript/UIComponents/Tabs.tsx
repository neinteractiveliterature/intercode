import React, { useState, ReactNode, useCallback, useMemo } from 'react';
import classNames from 'classnames';
import { useHistory, useLocation } from 'react-router-dom';

export type TabProps = {
  id: string;
  name: string;
  renderContent: () => ReactNode;
};

export function useTabs(tabs: TabProps[], initialTabId?: string) {
  const [selectedTab, setSelectedTab] = useState(initialTabId ?? tabs[0].id);

  return { tabs, selectedTab, setSelectedTab };
}

export function useTabsWithRouter(tabs: TabProps[], basePath: string, defaultTabId?: string) {
  const location = useLocation();
  const history = useHistory();
  const setSelectedTab = useCallback(
    (tabId: string) => {
      history.replace(`${basePath}#${tabId}`);
    },
    [history, basePath],
  );

  const tabFromHash = useMemo(() => tabs.find((tab) => `#${tab.id}` === location.hash), [
    location.hash,
    tabs,
  ]);

  return {
    tabs,
    selectedTab: tabFromHash ? tabFromHash.id : defaultTabId ?? tabs[0].id,
    setSelectedTab,
  };
}

export type TabListProps = {
  tabs: TabProps[];
  selectedTab?: string;
  setSelectedTab: (selectedTab: string) => void;
};

export function TabList({ tabs, selectedTab, setSelectedTab }: TabListProps) {
  return (
    <ul className="nav nav-tabs">
      {tabs.map(({ id, name }) => (
        <li key={id} className="nav-item">
          <a
            className={classNames('nav-link', { active: id === selectedTab })}
            href={`#${id}`}
            onClick={(event) => {
              event.preventDefault();
              setSelectedTab(id);
            }}
          >
            {name}
          </a>
        </li>
      ))}
    </ul>
  );
}

export type TabBodyProps = {
  tabs: TabProps[];
  selectedTab?: string;
};

export function TabBody({ tabs, selectedTab }: TabBodyProps) {
  return (
    <>
      {tabs.map(({ id, renderContent }) => (
        <div id={id} key={id} className={classNames({ 'd-none': id !== selectedTab })}>
          {renderContent()}
        </div>
      ))}
    </>
  );
}
