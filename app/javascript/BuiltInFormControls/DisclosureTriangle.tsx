import React from 'react';

export type DisclosureTriangleProps = {
  expanded: boolean;
};

function DisclosureTriangle({ expanded }: DisclosureTriangleProps) {
  if (expanded) {
    return <>▼</>;
  }

  return <>▶</>;
}

export default DisclosureTriangle;
