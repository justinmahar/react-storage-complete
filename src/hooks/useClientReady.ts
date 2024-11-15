import React from 'react';

/**
 * Returns false if SSR, or if the client (browser) has not finished rendering,
 * and returns true when running as a client after useEffect completes.
 * You can use this hook to avoid hydration issues.
 * See: https://blog.logrocket.com/fixing-gatsbys-rehydration-issue/
 */
export const useClientReady = () => {
  const [isClientReady, setClientReady] = React.useState(false);
  React.useEffect(() => {
    setClientReady(true);
  }, []);
  return isClientReady;
};
