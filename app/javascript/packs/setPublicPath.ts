function intercodeAssetURL(filename: string) {
  if (window.intercodeAssetsHost) {
    return `//${window.intercodeAssetsHost}/packs/${filename}`;
  } else {
    return `/packs/${filename}`;
  }
}

// eslint-disable-next-line no-underscore-dangle
window.__intercodeAssetURL = intercodeAssetURL;
