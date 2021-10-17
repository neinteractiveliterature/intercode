import { useCallback } from 'react';
import { humanize } from 'inflected';
import { stringify as csvStringify } from 'csv-string';
import { saveAs } from 'file-saver';
import { useTabs, TabBody, TabList } from '@neinteractiveliterature/litform';

import pluralizeWithCount from '../pluralizeWithCount';
import EmailList from '../UIComponents/EmailList';
import { ContactEmail } from '../graphqlTypes.generated';

export type TabbedMailingListProps = {
  emails: ContactEmail[];
  csvFilename: string;
  id?: string;
  metadataFields?: string[];
};

function TabbedMailingList({
  emails,
  id,
  metadataFields,
  csvFilename,
}: TabbedMailingListProps): JSX.Element {
  const exportCSV = useCallback(() => {
    const data = [
      ['Email', 'Name', ...(metadataFields ?? []).map((fieldName) => humanize(fieldName))],
      ...emails.map((email) => {
        const metadata = JSON.parse(email.metadata_json);
        return [
          email.email,
          email.name,
          ...(metadataFields ?? []).map((fieldName) => metadata[fieldName]),
        ];
      }),
    ];
    const blob = new Blob([csvStringify(data)], { type: 'text/csv; charset=utf-8' });
    saveAs(blob, csvFilename);
  }, [csvFilename, emails, metadataFields]);

  const idPrefix = id ? `${id}-` : '';
  const tabProps = useTabs(
    [
      {
        id: `${idPrefix}table-view`,
        name: 'Table view',
        renderContent: () => (
          <>
            <button type="button" className="btn btn-outline-primary mt-2" onClick={exportCSV}>
              <i className="bi-file-earmark-spreadsheet" /> Export CSV
            </button>

            <table className="table table-striped table-sm mt-2">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Name</th>
                  {(metadataFields ?? []).map((fieldName) => (
                    <th key={fieldName}>{humanize(fieldName)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {emails.map((email) => {
                  const metadata = JSON.parse(email.metadata_json);
                  return (
                    <tr key={email.email}>
                      <td>
                        <a href={`mailto:${email.formatted_address}`}>{email.email}</a>
                      </td>
                      <td>{email.name}</td>
                      {(metadataFields ?? []).map((fieldName) => (
                        <td key={fieldName}>{metadata[fieldName]}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        ),
      },
      {
        id: `${idPrefix}comma-separated`,
        name: 'Comma-separated',
        renderContent: () => (
          <div className="mt-2">
            <EmailList emails={emails} separator=", " />
          </div>
        ),
      },
      {
        id: `${idPrefix}semicolon-separated`,
        name: 'Semicolon-separated',
        renderContent: () => (
          <div className="mt-2">
            <EmailList emails={emails} separator="; " />
          </div>
        ),
      },
    ],
    'table-view',
  );

  return (
    <>
      <p className="lead mb-4">{pluralizeWithCount('recipient', emails.length)}</p>

      <TabList {...tabProps} />
      <TabBody {...tabProps} />
    </>
  );
}

export default TabbedMailingList;
