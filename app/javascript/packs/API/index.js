import jsonFetch from 'json-fetch';

export default {
  fetchFormContent(baseUrl) {
    return jsonFetch(baseUrl, { method: 'GET', expectedStatuses: [200] });
  },

  fetchConvention(baseUrl) {
    return jsonFetch(baseUrl, { method: 'GET', expectedStatuses: [200] });
  },

  fetchFormResponse(baseUrl) {
    return jsonFetch(baseUrl, { method: 'GET', expectedStatuses: [200] });
  },

  submitFormResponse(baseUrl, authenticityToken) {
    return jsonFetch(`${baseUrl}/submit`, {
      method: 'PATCH',
      headers: {
        'X-CSRF-Token': authenticityToken,
      },
      expectedStatuses: [204],
    });
  },

  updateFormResponse(baseUrl, response, authenticityToken) {
    return jsonFetch(baseUrl, {
      method: 'PATCH',
      headers: {
        'X-CSRF-Token': authenticityToken,
      },
      body: {
        form_response: response,
      },
      expectedStatuses: [204],
    });
  },
};
