import React from 'react';
import PropTypes from 'prop-types';

import { MyProfileQuery } from './queries.gql';
import useQuerySuspended from '../useQuerySuspended';
import ErrorDisplay from '../ErrorDisplay';
import BioForm from './BioForm';

function EditBio({ history }) {
  const { data, error } = useQuerySuspended(MyProfileQuery);

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <>
      <h1 className="mb-4">
        {'My '}
        {data.convention.name}
        {' Bio'}
      </h1>

      <BioForm userConProfile={data.myProfile} history={history} />
    </>
  );
}

EditBio.propTypes = {
  history: PropTypes.shape({}).isRequired,
};

export default EditBio;
