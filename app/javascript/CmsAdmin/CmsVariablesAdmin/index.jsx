import React from 'react';

import AddVariableRow from './AddVariableRow';
import ExistingVariableRow from './ExistingVariableRow';
import { CmsVariablesQuery } from './queries.gql';
import QueryWithStateDisplay from '../../QueryWithStateDisplay';

class CmsVariablesAdmin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      addingVariables: [],
    };
  }

  addVariable = () => {
    this.setState(prevState => ({
      addingVariables: [
        ...prevState.addingVariables,
        {
          key: '',
          value_json: '',
          generatedId: new Date().getTime(),
        },
      ],
    }));
  }

  addVariableChanged = (generatedId, value) => {
    this.setState(prevState => ({
      addingVariables: prevState.addingVariables.map((variable) => {
        if (variable.generatedId === generatedId) {
          return { ...variable, ...value };
        }

        return variable;
      }),
    }));
  }

  removeAddVariable = (generatedId) => {
    this.setState(prevState => ({
      addingVariables: prevState.addingVariables
        .filter(variable => variable.generatedId !== generatedId),
    }));
  }

  render = () => (
    <QueryWithStateDisplay query={CmsVariablesQuery}>
      {({ data: { cmsVariables } }) => (
        <table className="table">
          <thead>
            <tr>
              <th className="border-top-0">Name</th>
              <th className="border-top-0">Value (JSON format)</th>
              <th className="border-top-0" />
            </tr>
          </thead>
          <tbody>
            {cmsVariables.map(variable => (
              <ExistingVariableRow variable={variable} key={variable.key} />
            ))}
            {this.state.addingVariables.map(variable => (
              <AddVariableRow
                variable={variable}
                key={variable.generatedId}
                onChange={value => this.addVariableChanged(variable.generatedId, value)}
                onSave={generatedId => this.removeAddVariable(generatedId)}
                onCancel={generatedId => this.removeAddVariable(generatedId)}
              />
            ))}
            {
              (cmsVariables.length + this.state.addingVariables.length) === 0
                ? (
                  <tr>
                    <td colSpan="3" className="font-italic">No variables defined.</td>
                  </tr>
                )
                : null
            }
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={this.addVariable}
                >
                  Add variable
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      )}
    </QueryWithStateDisplay>
  )
}

export default CmsVariablesAdmin;
