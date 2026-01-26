export const assetUrl = (assetPath) => {
  const base = import.meta.env.BASE_URL || '/';
  const normalized = assetPath.startsWith('/') ? assetPath.slice(1) : assetPath;
  return `${base}${normalized}`;
};
