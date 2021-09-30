// eslint-disable-next-line no-restricted-imports
import { QueryResult, useQuery } from '@apollo/client';
import { useLocation } from 'react-router-dom';

import { LiquidAssignsQuery, NotifierLiquidAssignsQuery } from './queries';
import {
  LiquidAssignsQueryData,
  LiquidAssignsQueryVariables,
  NotifierLiquidAssignsQueryData,
  NotifierLiquidAssignsQueryVariables,
} from './queries.generated';

export type LiquidAssignsQueryFromLocation = [
  QueryResult<
    LiquidAssignsQueryData | NotifierLiquidAssignsQueryData,
    LiquidAssignsQueryVariables | NotifierLiquidAssignsQueryVariables
  >,
  string | null,
];

export type LiquidAssignsQueryFromLocationData = NonNullable<
  LiquidAssignsQueryFromLocation[0]['data']
>;

export default function useLiquidAssignsQueryFromLocation(): LiquidAssignsQueryFromLocation {
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
  ];
}
