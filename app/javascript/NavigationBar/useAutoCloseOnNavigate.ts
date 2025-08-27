import { useEffect, useContext, useRef } from 'react';
import { useLocation } from 'react-router';
import AuthenticationModalContext from '../Authentication/AuthenticationModalContext';

type LocationType = ReturnType<typeof useLocation>;

export default function useAutoCloseOnNavigate(
  setOpen: (open: boolean) => void,
  shouldAutoClose?: (prevLocation: LocationType, location: LocationType) => boolean,
): void {
  const location = useLocation();
  const { visible: authenticationModalVisible } = useContext(AuthenticationModalContext);
  const prevLocation = useRef<LocationType>(undefined);

  useEffect(() => {
    if (shouldAutoClose == null || (prevLocation.current && shouldAutoClose(prevLocation.current, location))) {
      setOpen(false);
    }
    prevLocation.current = location;
  }, [location, authenticationModalVisible, setOpen, shouldAutoClose]);
}
