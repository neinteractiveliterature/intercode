export default function buildPartialInput(partial) {
  return {
    name: partial.name,
    content: partial.content,
    admin_notes: partial.admin_notes,
  };
}
