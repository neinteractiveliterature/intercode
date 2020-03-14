import PropTypes from 'prop-types';

function DisclosureTriangle({ expanded }) {
  if (expanded) {
    return '▼';
  }

  return '▶';
}

DisclosureTriangle.propTypes = {
  expanded: PropTypes.bool.isRequired,
};

export default DisclosureTriangle;
