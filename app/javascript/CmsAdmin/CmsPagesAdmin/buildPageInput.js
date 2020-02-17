export default function buildPageInput(page) {
  return {
    name: page.name,
    admin_notes: page.admin_notes,
    slug: page.slug,
    skip_clickwrap_agreement: page.skip_clickwrap_agreement,
    hidden_from_search: page.hidden_from_search,
    cms_layout_id: (page.cms_layout || {}).id,
    content: page.content,
  };
}
