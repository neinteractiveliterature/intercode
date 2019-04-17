import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';

import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import ErrorDisplay from '../ErrorDisplay';
import { mutator, Transforms } from '../ComposableFormUtils';
import SelectWithLabel from '../BuiltInFormControls/SelectWithLabel';
import { UpdateRootSite } from './mutations.gql';

class EditRootSite extends React.Component {
  static propTypes = {
    initialRootSite: PropTypes.shape({
      site_name: PropTypes.string,
      default_layout: PropTypes.shape({}),
      root_page: PropTypes.shape({}),
    }).isRequired,
    cmsPages: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })).isRequired,
    cmsLayouts: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })).isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      rootSite: props.initialRootSite,
    };

    this.mutator = mutator({
      component: this,
      transforms: {
        rootSite: {
          site_name: Transforms.identity,
          default_layout: Transforms.identity,
          root_page: Transforms.identity,
        },
      },
    });
  }

  render = () => (
    <>
      <BootstrapFormInput
        name="site_name"
        label="Site name"
        helpText="This will show on the left side of the navigation bar"
        value={this.state.rootSite.site_name}
        onChangeText={this.mutator.rootSite.site_name}
      />

      <SelectWithLabel
        name="default_layout_id"
        label="Default layout for pages"
        value={this.state.rootSite.default_layout}
        isClearable
        getOptionValue={option => option.id}
        getOptionLabel={option => option.name}
        options={this.props.cmsLayouts}
        onChange={this.mutator.rootSite.default_layout}
        disabled={this.state.mutationInProgress}
      />

      <SelectWithLabel
        name="root_page_id"
        label="Root page"
        value={this.state.rootSite.root_page}
        isClearable
        getOptionValue={option => option.id}
        getOptionLabel={option => option.name}
        options={this.props.cmsPages}
        onChange={this.mutator.rootSite.root_page}
        disabled={this.state.mutationInProgress}
      />

      <ErrorDisplay graphQLError={this.state.error} />

      <Mutation mutation={UpdateRootSite}>
        {mutate => (
          <>
            <button
              className="btn btn-primary"
              type="button"
              disabled={this.state.mutationInProgress}
              onClick={async () => {
                this.setState({ success: false, error: null, mutationInProgress: true });
                try {
                  await mutate({
                    variables: {
                      siteName: this.state.rootSite.site_name,
                      rootPageId: this.state.rootSite.root_page.id,
                      defaultLayoutId: this.state.rootSite.default_layout.id,
                    },
                  });

                  this.setState({ success: true, mutationInProgress: false });
                } catch (error) {
                  this.setState({ error, mutationInProgress: false });
                }
              }}
            >
              Save settings
            </button>
            {
              this.state.success
                ? ' Saved!'
                : null
            }
          </>
        )}
      </Mutation>
    </>
  )
}

export default EditRootSite;
