import { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function useAutoClosingDropdownRef() {
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(
    () => {
      if (dropdownRef.current) {
        dropdownRef.current.setVisible(false);
      }
    },
    [location],
  );

  return dropdownRef;
}
