/* eslint-disable no-underscore-dangle */
// Taken from https://webpack.js.org/loaders/style-loader/#insert
export default function insertAtTop(element) {
  var parent = document.querySelector('head');
  window._elementsInsertedByStyleLoader ||= [];
  var lastInsertedElement = window._elementsInsertedByStyleLoader[window._elementsInsertedByStyleLoader.length - 1];

  if (!lastInsertedElement) {
    parent.appendChild(element, parent.firstChild);
  } else if (lastInsertedElement.nextSibling) {
    parent.insertBefore(element, lastInsertedElement.nextSibling);
  } else {
    parent.appendChild(element);
  }

  window._elementsInsertedByStyleLoader.push(element);
}
