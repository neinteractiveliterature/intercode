import { createContext } from 'react';
import { CmsLayout } from './graphqlTypes.generated';

export type CmsLayoutContext = {
  defaultLayout?: CmsLayout;
};

const CmsLayoutContext = createContext<CmsLayoutContext>({ defaultLayout: undefined });

export default CmsLayoutContext;
