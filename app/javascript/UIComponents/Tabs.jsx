import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export function useTabs(tabs, initialTabId = null) {
  const [selectedTab, setSelectedTab] = useState(initialTabId || tabs[0].id);

  return { tabs, selectedTab, setSelectedTab };
}

const TabsPropType = PropTypes.arrayOf(PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  renderContent: PropTypes.func.isRequired,
}));

export function TabList({ tabs, selectedTab, setSelectedTab }) {
  return (
    <ul className="nav nav-tabs">
      {
        tabs.map(({ id, name }) => (
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
        ))
      }
    </ul>
  );
}

TabList.propTypes = {
  tabs: TabsPropType.isRequired,
  selectedTab: PropTypes.string.isRequired,
  setSelectedTab: PropTypes.func.isRequired,
};

export function TabBody({ tabs, selectedTab }) {
  return (
    <>
      {
        tabs.map(({ id, renderContent }) => (
          <div id={id} key={id} className={classNames({ 'd-none': id !== selectedTab })}>
            {renderContent()}
          </div>
        ))
      }
    </>
  );
}

TabBody.propTypes = {
  tabs: TabsPropType.isRequired,
  selectedTab: PropTypes.string.isRequired,
};
