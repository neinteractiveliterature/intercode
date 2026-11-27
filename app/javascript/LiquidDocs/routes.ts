import { index, route } from '@react-router/dev/routes';
import { NamedRoute } from '../NamedRoute';

export default route('/liquid_docs', 'LiquidDocs/route.ts', { id: NamedRoute.LiquidDocs }, [
  route('assigns/:name', 'LiquidDocs/AssignDoc.tsx'),
  route('filters/:name', 'LiquidDocs/FilterDoc.tsx'),
  route('tags/:name', 'LiquidDocs/LiquidTagDoc.tsx'),
  index('LiquidDocs/index.tsx'),
]);
