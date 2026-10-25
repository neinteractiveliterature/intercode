// Avoid unnecessary layout checks when moving between pages that can't change layout
export function normalizePathForLayout(path: string) {
  if (path.startsWith('/pages/') || path.startsWith('/users/') || path.startsWith('/oauth/authorize') || path === '/') {
    return path;
  }

  // only event ID is relevant for layout rendering
  const eventsMatch = path.match(/^\/events\/(\d+)/);
  if (eventsMatch) {
    return `/events/${eventsMatch[1]}`;
  }

  return '/non_cms_path'; // arbitrary path that's not a CMS page
}
