import React from 'react';
import { humanize } from 'inflected';

import DocData from '../../../liquid_doc.json';

class LiquidDocs extends React.PureComponent {
  renderTag = (tag) => {
    if (tag.tag_name === 'example') {
      return (
        <li key={tag.tag_name}>
          <div className="card mt-4">
            <div className="card-header">
              {
                tag.name
                  ? (
                    <React.Fragment>
                      <strong>Example:</strong>
                      {' '}
                      {tag.name}
                    </React.Fragment>
                  )
                  : <strong>Example</strong>
              }
            </div>

            <div className="card-body">
              <code>{tag.text}</code>
            </div>
          </div>
        </li>
      );
    }

    return (
      <li key={tag.tag_name}>
        <strong>{humanize(tag.tag_name)}</strong>
        {
          tag.types
            ? (
              <React.Fragment>
                {' '}
                <em>
                  [
                  {tag.types.join(', ')}
                  ]
                </em>
              </React.Fragment>
            )
            : null
        }
        {
          tag.text
            ? (
              <React.Fragment>
                {' '}
                &mdash;
                {' '}
                {tag.text}
              </React.Fragment>
            )
            : null
        }
      </li>
    );
  }

  renderMethod = (method) => {
    if (method.tags.some(tag => tag.tag_name === 'api')) {
      return null;
    }

    return (
      <li key={method.name} className="list-group-item">
        <p className="mb-0">
          <h4>{method.name}</h4>
          {method.docstring}
        </p>

        <ul className="list-unstyled">
          {method.tags.map(tag => this.renderTag(tag))}
        </ul>
      </li>
    );
  }

  renderClass = klass => (
    <section key={klass.name} id={klass.name} className="card my-4">
      <div className="card-header">
        <h2>{klass.name}</h2>
        <p className="mb-0">{klass.docstring}</p>
      </div>

      <ul className="list-group list-group-flush">
        {klass.methods.sort((a, b) => a.name.localeCompare(b.name, { sensitivity: 'base' }))
          .map(method => this.renderMethod(method))}
      </ul>
    </section>
  )

  render = () => {
    const classes = DocData.classes.sort((a, b) => a.name.localeCompare(b.name, { sensitivity: 'base' }));

    return (
      <React.Fragment>
        {classes.map(klass => this.renderClass(klass))}
      </React.Fragment>
    );
  }
}

export default LiquidDocs;
