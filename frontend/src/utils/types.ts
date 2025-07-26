export type Item = {
  name: string;
  currencyPrice: bigint;
  id: number;
};

export type CartItem = {
  item: Item;
  quantity: number;
};
