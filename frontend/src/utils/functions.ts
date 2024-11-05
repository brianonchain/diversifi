export function getCookie(key: string) {
  let a = `; ${document.cookie}`.match(`;\\s*${key}=([^;]+)`);
  return a ? a[1] : "";
}
