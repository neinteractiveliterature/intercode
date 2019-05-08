export default function buildLayoutInput(layout) {
  return {
    name: layout.name,
    content: layout.content,
    navbar_classes: layout.navbar_classes,
    admin_notes: layout.admin_notes,
  };
}
