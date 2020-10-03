import { useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import AuthenticationModalContext from '../Authentication/AuthenticationModalContext';

export default function useAutoCloseOnNavigate(setOpen: (open: boolean) => void) {
  const location = useLocation();
  const { visible: authenticationModalVisible } = useContext(AuthenticationModalContext);

  useEffect(() => {
    setOpen(false);
  }, [location, authenticationModalVisible, setOpen]);
}
