import { gql, request } from "graphql-request";

export const POST = async (req: Request) => {
  console.log("entered getHistory api");
  const { userAddress, contractAddress, chain } = await req.json();

  if (chain == "Polygon") {
    // "!" after type means it's "non-nullable" - will throw error if null
    const query = gql`
      query ($address: Bytes!) {
        withdrawalEvents(where: { user: $address }) {
          amount
          transactionHash
          blockTimestamp
        }
        depositEvents(where: { user: $address }) {
          amount
          transactionHash
          blockTimestamp
        }
      }
    `;
    const vars = { address: userAddress };

    const url = "https://api.studio.thegraph.com/query/88146/depositcontract/version/latest";

    try {
      var { depositEvents, withdrawalEvents } = (await request({ url: url, document: query, variables: vars })) as any;

      // add event type and date, combine, and sort
      depositEvents.forEach((obj: any) => {
        obj.event = "deposit";
        obj.date = new Date(obj.blockTimestamp * 1000).toLocaleDateString();
      });
      withdrawalEvents.forEach((obj: any) => {
        obj.event = "withdrawal";
        obj.date = new Date(obj.blockTimestamp * 1000).toLocaleDateString();
      });
      const allEvents = depositEvents.concat(withdrawalEvents);
      allEvents.sort((x: any, y: any) => y.blockTimestamp - x.blockTimestamp);
      return Response.json(allEvents);
    } catch (e) {
      return Response.json([]);
    }
  } else {
    return Response.json([]);
  }
};
