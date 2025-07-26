export function getCookie(key: string) {
  let a = `; ${document.cookie}`.match(`;\\s*${key}=([^;]+)`);
  return a ? a[1] : "";
}

export function idToSku(id: number) {
  const padded = id.toString().padStart(9, "0");
  return `${padded.slice(0, 3)}-${padded.slice(3, 6)}-${padded.slice(6, 9)}`;
}
