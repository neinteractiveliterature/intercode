import { DateTime } from 'luxon';
import { DateTimeFormatKey } from '../DateTimeFormats';
import { SiteMode } from '../graphqlTypes.generated';
import Timespan, { FiniteTimespan } from '../Timespan';
import { TFunction } from 'i18next';
import { appDateTimeFormat } from '../TimeUtils';
import { useTranslation } from 'react-i18next';
import { useCallback, useContext } from 'react';
import AppRootContext from '../AppRootContext';
import { client } from '../useIntercodeApolloClient';
import { AppRootQueryData, AppRootQueryDocument } from '../appRootQueries.generated';
import { buildAppRootContextValue } from '../AppRoot';
import getI18n from '../setupI18Next';
import { getConventionDayTimespans } from '../TimespanUtils';
import { replace } from 'react-router';

function conventionDayUrlPortionFormat(
  siteMode: SiteMode | undefined,
  conventionTimespan: Timespan | undefined,
): DateTimeFormatKey {
  const conventionLengthInDays = conventionTimespan?.getLength('days');
  if (siteMode === SiteMode.Convention && conventionLengthInDays && conventionLengthInDays.days < 7) {
    return 'longWeekday';
  }

  return 'compactDate';
}

export function buildConventionDayUrlPortion(
  dayStart: DateTime,
  t: TFunction,
  siteMode: SiteMode | undefined,
  conventionTimespan: Timespan | undefined,
): string {
  return appDateTimeFormat(t, dayStart, conventionDayUrlPortionFormat(siteMode, conventionTimespan)).toLowerCase();
}

export function useConventionDayUrlPortion(): (dayStart: DateTime) => string {
  const { t } = useTranslation();
  const { conventionTimespan, siteMode } = useContext(AppRootContext);

  return useCallback(
    (dayStart) => buildConventionDayUrlPortion(dayStart, t, siteMode, conventionTimespan),
    [t, siteMode, conventionTimespan],
  );
}

export type ConventionDayLoaderResult = {
  conventionDayTimespans: FiniteTimespan[];
  conventionDayTimespansByUrlPortion: { [urlPortion: string]: FiniteTimespan };
  urlPortionsByTimespanStart: { [start: string]: string };
  matchingTimespan: FiniteTimespan;
};

export async function redirectToFirstDay({
  conventionDayTimespans,
  urlPortionsByTimespanStart,
  request,
}: Pick<ConventionDayLoaderResult, 'conventionDayTimespans' | 'urlPortionsByTimespanStart'> & { request: Request }) {
  const timespanStart = conventionDayTimespans[0]?.start.toISO();
  const urlPortion = timespanStart ? urlPortionsByTimespanStart[timespanStart] : undefined;
  const destination = urlPortion ? `/events/schedule/${urlPortion}` : undefined;

  if (!destination) {
    throw new Response('Not Found', { status: 404 });
  }

  const requestURL = new URL(request.url);
  if (requestURL.searchParams.size > 0) {
    return replace(`${destination}?${requestURL.searchParams.toString()}`);
  } else {
    return replace(destination);
  }
}

export async function conventionDayLoader({ params, request }: { params: { day?: string }; request: Request }) {
  const { data } = await client.query<AppRootQueryData>({ query: AppRootQueryDocument });
  const { conventionTimespan, timezoneName, siteMode } = buildAppRootContextValue(data);
  const { t } = await getI18n();

  const conventionDayTimespans = conventionTimespan?.isFinite()
    ? getConventionDayTimespans(conventionTimespan, timezoneName)
    : [];

  const conventionDayTimespansByUrlPortion = conventionDayTimespans.reduce<{ [urlPortion: string]: FiniteTimespan }>(
    (memo, timespan) => {
      const urlPortion = buildConventionDayUrlPortion(timespan.start, t, siteMode, conventionTimespan);
      return { ...memo, [urlPortion]: timespan };
    },
    {},
  );

  const urlPortionsByTimespanStart = Object.entries(conventionDayTimespansByUrlPortion).reduce<{
    [start: string]: string;
  }>((memo, [urlPortion, timespan]) => {
    const timespanStart = timespan.start.toISO();
    if (timespanStart == null) {
      return memo;
    } else {
      return { ...memo, [timespanStart]: urlPortion };
    }
  }, {});

  const matchingTimespan = params.day ? conventionDayTimespansByUrlPortion[params.day] : undefined;

  if (!matchingTimespan) {
    if (conventionDayTimespans.length > 0) {
      return redirectToFirstDay({ conventionDayTimespans, urlPortionsByTimespanStart, request });
    } else {
      throw new Response(null, { status: 404 });
    }
  }

  return {
    conventionDayTimespans,
    matchingTimespan,
    urlPortionsByTimespanStart,
    conventionDayTimespansByUrlPortion,
  } satisfies ConventionDayLoaderResult;
}
