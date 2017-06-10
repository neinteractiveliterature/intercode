function fetchAndThrow(...params) {
  return fetch(...params).then((response) => {
    if (response.status >= 200 && response.status < 300) {
      return response;
    }

    const error = new Error(response.statusText);
    error.response = response;
    throw error;
  });
}

function getCSRFToken() {
  return document.querySelectorAll('meta[name=csrf-token]')[0].content;
}

function getJSONRequestHeaders() {
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHTTPRequest',
    'X-CSRF-Token': getCSRFToken(),
  };
}

function buildJSONFetchOptions(options) {
  return Object.assign(
    {},
    options,
    {
      headers: getJSONRequestHeaders(),
      body: JSON.stringify(options.body),
      credentials: 'same-origin',
    },
  );
}

export {
  fetchAndThrow,
  getCSRFToken,
  getJSONRequestHeaders,
  buildJSONFetchOptions,
};
