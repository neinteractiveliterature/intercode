// Taken from https://webpack.js.org/loaders/style-loader/#insert
export default function insertAtTop(element) {
  var parent = document.querySelector('head');
  // eslint-disable-next-line no-underscore-dangle
  var lastInsertedElement = window._lastElementInsertedByStyleLoader;

  if (!lastInsertedElement) {
    parent.insertBefore(element, parent.firstChild);
  } else if (lastInsertedElement.nextSibling) {
    parent.insertBefore(element, lastInsertedElement.nextSibling);
  } else {
    parent.appendChild(element);
  }

  // eslint-disable-next-line no-underscore-dangle
  window._lastElementInsertedByStyleLoader = element;
}
