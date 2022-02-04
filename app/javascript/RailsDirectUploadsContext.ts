import React from 'react';

export type RailsDirectUploadsContextValue = {
  railsDirectUploadsUrl: string;
  railsDefaultActiveStorageServiceName: string;
};

const RailsDirectUploadsContext = React.createContext({
  railsDirectUploadsUrl: '',
  railsDefaultActiveStorageServiceName: '',
});

export default RailsDirectUploadsContext;
