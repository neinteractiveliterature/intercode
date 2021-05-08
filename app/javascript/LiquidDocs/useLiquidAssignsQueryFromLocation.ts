// eslint-disable-next-line no-restricted-imports
import { useQuery } from '@apollo/client';
import { useLocation } from 'react-router-dom';

import { LiquidAssignsQuery, NotifierLiquidAssignsQuery } from './queries';
import {
  LiquidAssignsQueryData,
  LiquidAssignsQueryVariables,
  NotifierLiquidAssignsQueryData,
  NotifierLiquidAssignsQueryVariables,
} from './queries.generated';

export default function useLiquidAssignsQueryFromLocation() {
  const location = useLocation();
  const notifierEventKey = location.search
    ? new URLSearchParams(location.search).get('notifier_event_key')
    : null;

  return [
    useQuery<
      NotifierLiquidAssignsQueryData | LiquidAssignsQueryData,
      NotifierLiquidAssignsQueryVariables | LiquidAssignsQueryVariables
    >(notifierEventKey ? NotifierLiquidAssignsQuery : LiquidAssignsQuery, {
      variables: notifierEventKey ? { eventKey: notifierEventKey } : {},
    }),
    notifierEventKey,
  ] as const;
}

export type LiquidAssignsQueryFromLocation = NonNullable<
  ReturnType<typeof useLiquidAssignsQueryFromLocation>[0]['data']
>;
