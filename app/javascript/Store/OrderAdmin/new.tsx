import { useNavigate } from 'react-router';
import NewOrderModal from './NewOrderModal';

function NewOrderRoute() {
  const navigate = useNavigate();

  return <NewOrderModal close={() => navigate('..')} visible />;
}

export default NewOrderRoute;
