export const loadFlatted = async () => {
  const flatted = await import('flatted');
  return flatted;
};

export default loadFlatted();
