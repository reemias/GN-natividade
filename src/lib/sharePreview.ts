export function getSharePreviewUrl(fileName: string): string {
  const url = new URL(
    `${import.meta.env.BASE_URL}compartilhar/${fileName}`,
    window.location.origin,
  );
  return url.toString();
}
