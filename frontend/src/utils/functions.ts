export function getCookie(key: string) {
  let a = `; ${document.cookie}`.match(`;\\s*${key}=([^;]+)`);
  return a ? a[1] : "";
}

export function idToSku(id: number) {
  const padded = id.toString().padStart(9, "0");
  return `${padded.slice(0, 3)}-${padded.slice(3, 6)}-${padded.slice(6, 9)}`;
}

export function timestampToDate(timestamp: string): string {
  const date = new Date(Number(timestamp) * 1000);
  const mdy = date.toLocaleDateString("en-US").split("/");
  const month = parseInt(mdy[0]);
  const day = parseInt(mdy[1]);
  const year = parseInt(mdy[2]);
  return `${year}-${month}-${day}`;
}

export function timestampToTime(timestamp: number): string {
  const date = new Date(timestamp);
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // convert 0 to 12 for 12-hour format
  return `${hours}:${minutes}${ampm}`;
}

export function shortenAddress(address: string): string {
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    throw new Error("Invalid Ethereum address");
  }
  return `0x${address.slice(2, 6)}...${address.slice(-4)}`;
}

export function getCurrencyValue(items: any): string {
  let currencyValue = 0;
  for (const item of items) {
    currencyValue += item.currencyPrice * item.quantity;
  }
  return currencyValue.toString();
}
