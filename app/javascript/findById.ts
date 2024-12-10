export function findById<T extends { id: string }>(items: T[], id: string): T {
  const item = items.find((item) => item.id === id);
  if (!item) {
    throw new Response('Not Found', { status: 404 });
  }

  return item;
}
