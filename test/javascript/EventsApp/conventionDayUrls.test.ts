import { ApolloClient, InMemoryCache } from '@apollo/client';
import { MockLink } from '@apollo/client/testing';
import { DateTime } from 'luxon';

import {
  buildConventionDayUrlPortion,
  conventionDayLoader,
  redirectToFirstDay,
} from '../../../app/javascript/EventsApp/conventionDayUrls';
import { AppRootQueryDocument } from '../../../app/javascript/appRootQueries.generated';
import getI18n from '../../../app/javascript/setupI18Next';
import { SiteMode } from '../../../app/javascript/graphqlTypes.generated';
import Timespan, { FiniteTimespan } from '../../../app/javascript/Timespan';
import { AppRootConvention, buildAppRootConvention, buildAppRootData } from '../fixtures/appRoot';

describe('buildConventionDayUrlPortion', () => {
  const friday = DateTime.fromISO('2026-06-05T06:00:00', { zone: 'America/New_York' });

  it('is the lowercase weekday name for a convention site with a convention under a week long', async () => {
    const { t } = await getI18n();
    const threeDays = Timespan.fromStrings('2026-06-05T10:00:00Z', '2026-06-08T10:00:00Z');

    expect(buildConventionDayUrlPortion(friday, t, SiteMode.Convention, threeDays)).toBe('friday');
  });

  it('is a compact date for a convention that is a week long or more, since weekday names would repeat', async () => {
    const { t } = await getI18n();
    const twoWeeks = Timespan.fromStrings('2026-06-05T10:00:00Z', '2026-06-19T10:00:00Z');

    const portion = buildConventionDayUrlPortion(friday, t, SiteMode.Convention, twoWeeks);

    expect(portion).not.toBe('friday');
    expect(portion).toMatch(/2026|06|jun/i);
  });

  it.each([SiteMode.SingleEvent, SiteMode.EventSeries, undefined])(
    'is a compact date when the site mode is %s, however short the convention',
    async (siteMode) => {
      const { t } = await getI18n();
      const threeDays = Timespan.fromStrings('2026-06-05T10:00:00Z', '2026-06-08T10:00:00Z');

      expect(buildConventionDayUrlPortion(friday, t, siteMode, threeDays)).not.toBe('friday');
    },
  );

  it('is a compact date when the convention has no dates', async () => {
    const { t } = await getI18n();

    expect(buildConventionDayUrlPortion(friday, t, SiteMode.Convention, undefined)).not.toBe('friday');
  });
});

describe('redirectToFirstDay', () => {
  const days = (): FiniteTimespan[] => [
    Timespan.finiteFromStrings('2026-06-05T10:00:00Z', '2026-06-06T10:00:00Z'),
    Timespan.finiteFromStrings('2026-06-06T10:00:00Z', '2026-06-07T10:00:00Z'),
  ];
  const urlPortionsByTimespanStart = (timespans: FiniteTimespan[]) => ({
    [timespans[0].start.toISO() as string]: 'friday',
    [timespans[1].start.toISO() as string]: 'saturday',
  });

  const redirect = (url: string, timespans = days()) =>
    redirectToFirstDay({
      conventionDayTimespans: timespans,
      urlPortionsByTimespanStart: urlPortionsByTimespanStart(days()),
      request: new Request(url),
    });

  it('goes to the schedule page for the first day', async () => {
    const response = await redirect('http://localhost/events/schedule');

    expect(response.status).toBe(302);
    expect(response.headers.get('Location')).toBe('/events/schedule/friday');
  });

  it('keeps the query string', async () => {
    const response = await redirect('http://localhost/events/schedule?filters.title=game&sort=title');

    expect(response.headers.get('Location')).toBe('/events/schedule/friday?filters.title=game&sort=title');
  });

  it('is a 404 when there are no days', async () => {
    await expect(redirect('http://localhost/events/schedule', [])).rejects.toMatchObject({ status: 404 });
  });

  it('is a 404 when the first day has no URL portion', async () => {
    await expect(
      redirectToFirstDay({
        conventionDayTimespans: days(),
        urlPortionsByTimespanStart: {},
        request: new Request('http://localhost/events/schedule'),
      }),
    ).rejects.toMatchObject({ status: 404 });
  });
});

describe('conventionDayLoader', () => {
  const loadDay = async (
    day: string | undefined,
    convention: AppRootConvention | null = buildAppRootConvention(),
    search = '',
  ) => {
    const mock: MockLink.MockedResponse = {
      request: { query: AppRootQueryDocument },
      result: { data: buildAppRootData(convention) },
    };
    const client = new ApolloClient({ cache: new InMemoryCache(), link: new MockLink([mock]) });

    return conventionDayLoader(client, {
      params: { day },
      request: new Request(`http://localhost/events/schedule${search}`),
    });
  };

  // 10am to 6pm New York time on Friday, Saturday and Sunday: with 6am convention days, that's three days
  it('finds the day named in the URL', async () => {
    const result = await loadDay('saturday');

    if (!('matchingTimespan' in result)) {
      throw new Error('expected a day, not a redirect');
    }
    expect(result.conventionDayTimespans).toHaveLength(3);
    expect(result.matchingTimespan.start.setZone('America/New_York').toFormat('cccc')).toBe('Saturday');
    expect(Object.keys(result.conventionDayTimespansByUrlPortion)).toEqual(['friday', 'saturday', 'sunday']);
    expect(Object.values(result.urlPortionsByTimespanStart)).toEqual(['friday', 'saturday', 'sunday']);
  });

  it('redirects to the first day when no day is given', async () => {
    const result = await loadDay(undefined);

    expect(result).toBeInstanceOf(Response);
    expect((result as Response).headers.get('Location')).toBe('/events/schedule/friday');
  });

  it('redirects to the first day, keeping the query, when the day isn’t one of the convention’s', async () => {
    const result = await loadDay('monday', buildAppRootConvention(), '?sort=title');

    expect((result as Response).headers.get('Location')).toBe('/events/schedule/friday?sort=title');
  });

  it('is a 404 when the convention has no dates, so there are no days', async () => {
    await expect(loadDay('friday', buildAppRootConvention({ starts_at: null, ends_at: null }))).rejects.toMatchObject({
      status: 404,
    });
  });

  it('is a 404 when there is no convention at all', async () => {
    await expect(loadDay('friday', null)).rejects.toMatchObject({ status: 404 });
  });
});
