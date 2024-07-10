import { Link, useLocation } from 'react-router-dom';

import LiquidTagDocHeader from './LiquidTagDocHeader';
import TagDoc from './TagDoc';
import { YardClass } from './DocData';

export type LiquidTagDocProps = {
  liquidTag: YardClass;
};

function LiquidTagDoc({ liquidTag }: LiquidTagDocProps): JSX.Element {
  const location = useLocation();

  return (
    <>
      <nav aria-label="breadcrumb mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to={`/liquid_docs${location.search}`}>Documentation home</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {liquidTag.name}
          </li>
        </ol>
      </nav>

      <section id={liquidTag.name} className="card my-4">
        <div className="card-header">
          <LiquidTagDocHeader liquidTag={liquidTag} />
        </div>

        <div className="card-body">
          <ul className="list-unstyled">
            {liquidTag.tags
              .filter((tag) => tag.tag_name !== 'liquid_tag_name')
              .map((tag, i) => (
                 
                <TagDoc tag={tag} key={i} />
              ))}
          </ul>
        </div>
      </section>
    </>
  );
}

export default LiquidTagDoc;
