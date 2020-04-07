export default function scrollToLocationHash() {
  const { hash } = window.location;
  if (hash && hash.startsWith('#')) {
    const id = hash.substr(1);
    const element = document.getElementById(id) || (document.getElementsByName(id) || [])[0];
    if (element) {
      element.scrollIntoView();
    }
  }
}
