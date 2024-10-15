import { gql, request } from "graphql-request";

export const POST = async (req: Request) => {
  console.log("entered getHistory api");
  const { userAddress } = await req.json();

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
    const data = (await request({ url: url, document: query, variables: vars })) as any;
    return Response.json(data);
  } catch (e) {
    return Response.json("error");
  }
};
