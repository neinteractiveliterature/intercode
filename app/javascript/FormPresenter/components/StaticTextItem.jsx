// @flow

import React from 'react';

type Props = {
  formItem: {
    content: string,
    style?: string,
  },
}

const StaticTextItem = ({ formItem }: Props) => {
  switch (formItem.properties.style) {
    case 'subhead':
      // eslint-disable-next-line react/no-danger
      return <div className="lead" dangerouslySetInnerHTML={{ __html: formItem.properties.content }} />;
    default:
      // eslint-disable-next-line react/no-danger
      return <div dangerouslySetInnerHTML={{ __html: formItem.properties.content }} />;
  }
};

export default StaticTextItem;
