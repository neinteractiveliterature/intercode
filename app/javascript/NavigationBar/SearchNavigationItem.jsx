import React from 'react';

import PopperDropdown from '../UIComponents/PopperDropdown';
import useAutoClosingDropdownRef from './useAutoClosingDropdownRef';
import SiteSearch from './SiteSearch';


function SearchNavigationItem() {
  const dropdownRef = useAutoClosingDropdownRef();
  return (
    <li className="nav-item">
      <PopperDropdown
        ref={dropdownRef}
        renderReference={({ ref, toggle }) => (
          <button className="btn btn-link nav-link" type="button" ref={ref} onClick={toggle}>
            <i className="fa fa-search" />
            <span className="sr-only">Search</span>
          </button>
        )}
        style={{ zIndex: 1100 }}
        modifiers={{
          placeOverButton: {
            enabled: true,
            order: 750,
            fn: (data) => {
              const { popper, reference } = data.offsets;
              popper.top = reference.top;
              popper.left = reference.right - popper.width;
              if (popper.left < 0) {
                popper.left = reference.left;
              }
              return data;
            },
          },
        }}
      >
        {({
          ref, style, visible, setVisible,
        }) => (
          <div ref={ref} style={{ ...style, minWidth: '300px' }} className={visible ? '' : 'd-none'}>
            <SiteSearch setVisible={setVisible} visible={visible} close={() => setVisible(false)} />
          </div>
        )}
      </PopperDropdown>
    </li>
  );
}

export default SearchNavigationItem;
