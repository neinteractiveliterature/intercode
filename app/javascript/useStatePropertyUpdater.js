export default function useStatePropertyUpdater(setState) {
  return (field) => (value) => setState((state) => ({
    ...state, [field]: value,
  }));
}
