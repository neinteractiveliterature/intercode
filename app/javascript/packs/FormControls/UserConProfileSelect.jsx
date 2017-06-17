import React from 'react';
import VirtualizedSelect from 'react-virtualized-select';
import createFilterOptions from 'react-select-fast-filter-options';
import queryString from 'query-string';
import 'react-select/dist/react-select.css';
import 'react-virtualized/styles.css';
import 'react-virtualized-select/styles.css';
import { performJSONRequest } from '../HTTPUtils';

class UserConProfileSelect extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options: null,
      filterOptions: null,
    };
  }

  // react-select async behavior is broken with multi-select, so for now we'll load all the user
  // con profiles and provide them once to a synchronous select
  //
  // https://github.com/JedWatson/react-select/issues/1771
  componentDidMount = () => {
    this.loadOptions().then((results) => {
      this.setState({
        options: results.options,
        filterOptions: createFilterOptions(results.options),
      });
    });
  }

  loadOptions = (input) => {
    const params = { 'user_con_profiles_grid[name]': input, per_page: 1000 };
    const url = `/user_con_profiles?${queryString.stringify(params)}`;

    const processPage = (json) => {
      const options = json.user_con_profiles.map(userConProfile => ({
        label: `${userConProfile.first_name} ${userConProfile.last_name}`,
        value: userConProfile.id,
      }));

      let nextUrl;
      if (json.page_info.next_page) {
        const nextUrlParams = { page: json.page_info.next_page, ...params };
        nextUrl = `/user_con_profiles?${queryString.stringify(nextUrlParams)}`;
      }

      return { options, nextUrl };
    };

    const processResults = (results) => {
      if (results.nextUrl) {
        return performJSONRequest(results.nextUrl).then((nextResults) => {
          const processedPage = processPage(nextResults);

          return {
            options: results.options.concat(processedPage.options),
            nextUrl: processedPage.nextUrl,
          };
        }).then(processResults);
      }

      return {
        options: results.options,
        complete: (!input || input === ''),
      };
    };

    return performJSONRequest(url).then(processPage).then(processResults);
  }

  render = () => {
    if (!this.state.options) {
      return (
        <div>
          Loading... <i className="fa fa-circle-o-notch fa-spin" aria-hidden="true" />
        </div>
      );
    }

    return (
      <VirtualizedSelect
        options={this.state.options}
        {...this.props}
      />
    );
  }
}

export default UserConProfileSelect;
