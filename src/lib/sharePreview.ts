export function getSharePreviewUrl(fileName: string): string {
  const url = new URL(
    `${import.meta.env.BASE_URL}compartilhar/${fileName}`,
    window.location.origin,
  );
  url.searchParams.set("v", import.meta.env.VITE_SHARE_PREVIEW_VERSION);
  return url.toString();
}
