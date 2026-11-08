import { within } from '@testing-library/react';

// Helpers for reading a rendered ReactTableWithTheWorks table the way a user would.  They look at rows, column headers
// and cell text rather than at any table library object, so they work for every table page.

type TableQueries = {
  getAllByRole: (role: string) => HTMLElement[];
  getByText: (text: string | RegExp) => HTMLElement;
};

/** The text of each column header, without the sort arrow. */
export function columnHeaders(r: TableQueries): (string | undefined)[] {
  return within(r.getAllByRole('row')[0])
    .getAllByRole('columnheader')
    .map((th) => th.textContent?.replace(/[ ▴▾]/g, '').trim());
}

/** The text of each cell in a row. */
export function cellTexts(row: HTMLElement): (string | undefined)[] {
  return Array.from(row.querySelectorAll('td')).map((cell) => cell.textContent?.trim());
}

/** The body row containing some text. */
export function rowFor(r: TableQueries, text: string | RegExp): HTMLElement {
  return r.getByText(text).closest('tr') as HTMLElement;
}

/** The cell in the filter row (the row right after the headers) under a column header. */
export function filterCell(r: TableQueries, columnHeader: string): HTMLElement {
  const index = columnHeaders(r).indexOf(columnHeader);
  if (index < 0) {
    throw new Error(`No column headed "${columnHeader}"`);
  }
  return within(r.getAllByRole('row')[1]).getAllByRole('columnheader')[index];
}

/** The header button that sorts by a column. */
export function sortButton(r: TableQueries, columnHeader: string | RegExp): HTMLElement {
  return within(r.getAllByRole('row')[0]).getByRole('button', { name: columnHeader });
}
