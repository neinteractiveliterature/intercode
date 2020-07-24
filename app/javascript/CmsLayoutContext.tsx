import React from 'react';
import { CmsLayout } from './graphqlTypes.generated';

export type CmsLayoutContext = {
  defaultLayout?: CmsLayout,
};

const CmsLayoutContext = React.createContext<CmsLayoutContext>({ defaultLayout: undefined });

export default CmsLayoutContext;
