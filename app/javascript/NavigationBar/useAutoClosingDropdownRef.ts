import { useRef, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { PopperDropdownImperativeHandle } from '../UIComponents/PopperDropdown';
import AuthenticationModalContext from '../Authentication/AuthenticationModalContext';

export default function useAutoClosingDropdownRef() {
  const location = useLocation();
  const dropdownRef = useRef<PopperDropdownImperativeHandle>(null);
  const { visible: authenticationModalVisible } = useContext(AuthenticationModalContext);

  useEffect(
    () => {
      if (dropdownRef.current) {
        dropdownRef.current.setVisible(false);
      }
    },
    [location, authenticationModalVisible],
  );

  return dropdownRef;
}
