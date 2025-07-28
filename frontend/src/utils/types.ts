// for /pay and /merchantDash

export type CurrencyInfo = {
  code: string; // ISO 4217
  symbol: string;
  decimals: number; // USD=2, TWD=0, EUR=2
  rateDecimals: number; // USD=6, TWD=6, EUR=6
};

export type Item = {
  name: string;
  currencyPrice: bigint;
  id: number;
};

export type CartItem = {
  item: Item;
  quantity: number;
};
