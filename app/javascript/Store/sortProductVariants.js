const compareProductVariants = (a, b) => {
  if (a.position == null) {
    if (b.position == null) {
      return a.id - b.id;
    }

    return 1;
  }

  if (b.position == null) {
    return -1;
  }

  return a.position - b.position;
};

export default function sortProductVariants(variants) {
  return [...variants].sort(compareProductVariants);
}
