import { Link, useLocation } from 'react-router';
import { YardClass } from './DocData';

import findLiquidTagName from './findLiquidTagName';
import LiquidTagDocHeader from './LiquidTagDocHeader';

export type LiquidTagDocLinkProps = {
  liquidTag: YardClass;
};

function LiquidTagDocLink({ liquidTag }: LiquidTagDocLinkProps): JSX.Element {
  const location = useLocation();
  const liquidTagName = findLiquidTagName(liquidTag);

  return (
    <Link to={`/liquid_docs/tags/${liquidTagName}${location.search}`} className="card-link m-0 text-body">
      <div className="card mb-2">
        <div className="card-header">
          <LiquidTagDocHeader liquidTag={liquidTag} />
        </div>
      </div>
    </Link>
  );
}

export default LiquidTagDocLink;
