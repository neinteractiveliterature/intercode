function getCSRFToken() {
  return document.querySelectorAll('meta[name=csrf-token]')[0].content;
}

export default getCSRFToken;
