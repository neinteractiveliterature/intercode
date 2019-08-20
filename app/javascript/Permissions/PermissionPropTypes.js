import PropTypes from 'prop-types';

export const PermissionNamePropType = PropTypes.shape({
  name: PropTypes.string.isRequired,
  permission: PropTypes.string.isRequired,
});

export const ModelPropType = PropTypes.shape({
  __typename: PropTypes.string.isRequired,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
});

export const PermissionPropType = PropTypes.shape({
  model: ModelPropType.isRequired,
  permission: PropTypes.string.isRequired,
});
