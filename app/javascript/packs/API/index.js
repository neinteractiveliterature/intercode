import jsonFetch from 'json-fetch';

export default {
  fetchFormContent(baseUrl) {
    return jsonFetch(baseUrl, { method: 'GET', expectedStatuses: [200] });
  },

  fetchConvention(baseUrl) {
    return jsonFetch(baseUrl, { method: 'GET', expectedStatuses: [200] });
  },
};
