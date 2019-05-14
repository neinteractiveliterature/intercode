import { useRef, useEffect } from 'react';

export default function useAutoClosingDropdownRef(location) {
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
