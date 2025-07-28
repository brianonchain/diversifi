import { gql, request } from "graphql-request";
import { formatUnits } from "viem";

type DecodedItem = {
  version: string;
  currencyId: string;
  cashback: string;
  quantity: string;
  id: string;
  currencyPrice: string;
  usdcReceived: string;
};

type DecodedPayEvent = {
  from: string;
  amount: string;
  items: DecodedItem[];
  blockTimestamp: string;
  txHash: string;
};

const currencyDecimals = 0; // TWD=0, USD=2, EUR=2

export const POST = async (req: Request) => {
  console.log("entered getMerchantPayment api");
  const { merchantAddress, chain } = await req.json();

  if (chain.name === "Sepolia") {
    const query = gql`
      query ($address: Bytes!) {
        payEvents(where: { to: $address }, orderBy: blockTimestamp, orderDirection: desc) {
          from
          amount
          items
          blockTimestamp
          transactionHash
        }
      }
    `;
    const variables = { address: merchantAddress };
    const url = `https://api.studio.thegraph.com/query/${process.env.GRAPH_USER_ID}/diversifi-payment/version/latest`;

    try {
      var { payEvents } = (await request({ url, document: query, variables })) as any;
      console.log("payEvents", payEvents);
      // DECODE PAY EVENTS
      const payEventsDecoded = [];
      for (const payEvent of payEvents) {
        // declare payEventDecoded
        const payEventDecoded: DecodedPayEvent = {
          from: payEvent.from,
          amount: payEvent.amount,
          items: [],
          blockTimestamp: payEvent.blockTimestamp,
          txHash: payEvent.transactionHash,
        };
        // iterate over items
        for (const item of payEvent.items) {
          const itemNoPadding = item.slice(16); // remove "0x" and 14 "0" on left
          const version = parseInt(itemNoPadding.slice(0, 2), 16).toString();
          const currencyId = parseInt(itemNoPadding.slice(2, 4), 16).toString();
          const cashback = (parseInt(itemNoPadding.slice(4, 6), 16) / 10).toFixed(2);
          const quantity = parseInt(itemNoPadding.slice(6, 10), 16).toString();
          const id = parseInt(itemNoPadding.slice(10, 18), 16).toString();
          const currencyPrice = formatUnits(BigInt(parseInt(itemNoPadding.slice(18, 34), 16)), currencyDecimals); // hex => int > bigint > string with decimals
          const usdcReceived = formatUnits(BigInt(parseInt(itemNoPadding.slice(34, 50), 16)), 6); // hex => int > bigint > string with decimals
          payEventDecoded.items.push({ version, currencyId, cashback, quantity, id, currencyPrice, usdcReceived });
        }
        // push to array
        payEventsDecoded.push(payEventDecoded);
      }
      return Response.json(payEventsDecoded);
    } catch (e) {
      console.log("error", e);
      return Response.json([]);
    }
  } else {
    return Response.json([]);
  }
};
