import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';

type LocationType = ReturnType<typeof useLocation>;

export default function useAutoCloseOnNavigate(
  setOpen: (open: boolean) => void,
  shouldAutoClose?: (prevLocation: LocationType, location: LocationType) => boolean,
): void {
  const location = useLocation();
  const prevLocation = useRef<LocationType>(undefined);

  useEffect(() => {
    if (shouldAutoClose == null || (prevLocation.current && shouldAutoClose(prevLocation.current, location))) {
      setOpen(false);
    }
    prevLocation.current = location;
  }, [location, setOpen, shouldAutoClose]);
}
