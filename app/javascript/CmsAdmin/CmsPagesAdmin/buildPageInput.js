export default function buildPageInput(page) {
  return {
    name: page.name,
    admin_notes: page.admin_notes,
    slug: page.slug,
    skip_clickwrap_agreement: page.skip_clickwrap_agreement,
    cms_layout_id: (page.cms_layout || {}).id,
    content: page.content,
  };
}
