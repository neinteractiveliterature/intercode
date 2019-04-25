import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { humanize } from 'inflected';
import { stringify as csvStringify } from 'csv-string';
import { saveAs } from 'file-saver';

import pluralizeWithCount from '../pluralizeWithCount';
import { useTabs, TabBody, TabList } from '../UIComponents/Tabs';
import EmailList from '../UIComponents/EmailList';

function TabbedMailingList({
  emails, id, metadataFields, csvFilename,
}) {
  const exportCSV = useCallback(
    () => {
      const data = [
        ['Email', 'Name', ...metadataFields.map(fieldName => humanize(fieldName))],
        ...emails.map((email) => {
          const metadata = JSON.parse(email.metadata_json);
          return [
            email.email,
            email.name,
            ...metadataFields.map(fieldName => metadata[fieldName]),
          ];
        }),
      ];
      const blob = new Blob([csvStringify(data)], { type: 'text/csv; charset=utf-8' });
      saveAs(blob, csvFilename);
    },
    [csvFilename, emails, metadataFields],
  );

  const idPrefix = id ? `${id}-` : '';
  const tabProps = useTabs([
    {
      id: `${idPrefix}table-view`,
      name: 'Table view',
      renderContent: () => (
        <>
          <button type="button" className="btn btn-outline-primary mt-2" onClick={exportCSV}>
            <i className="fa fa-file-excel-o" />
            {' '}
            Export CSV
          </button>

          <table className="table table-striped table-sm mt-2">
            <thead>
              <tr>
                <th>Email</th>
                <th>Name</th>
                {metadataFields.map(fieldName => (
                  <th key={fieldName}>{humanize(fieldName)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {emails.map((email) => {
                const metadata = JSON.parse(email.metadata_json);
                return (
                  <tr key={email.email}>
                    <td><a href={`mailto:${email.formatted_address}`}>{email.email}</a></td>
                    <td>{email.name}</td>
                    {metadataFields.map(fieldName => (
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
      renderContent: () => <div className="mt-2"><EmailList emails={emails} separator=", " /></div>,
    },
    {
      id: `${idPrefix}semicolon-separated`,
      name: 'Semicolon-separated',
      renderContent: () => <div className="mt-2"><EmailList emails={emails} separator="; " /></div>,
    },
  ], 'table-view');

  return (
    <>
      <p className="lead mb-4">{pluralizeWithCount('recipient', emails.length)}</p>

      <TabList {...tabProps} />
      <TabBody {...tabProps} />
    </>
  );
}

TabbedMailingList.propTypes = {
  emails: PropTypes.arrayOf(PropTypes.shape({
    email: PropTypes.string.isRequired,
    formatted_address: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    metadata_json: PropTypes.string.isRequired,
  })).isRequired,
  id: PropTypes.string,
  csvFilename: PropTypes.string.isRequired,
  metadataFields: PropTypes.arrayOf(PropTypes.string),
};

TabbedMailingList.defaultProps = {
  id: null,
  metadataFields: [],
};

export default TabbedMailingList;
