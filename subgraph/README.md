# Multi-Chain Subgraph Setup

This subgraph supports querying data from the same contract deployed on multiple chains.

## Supported Networks

- **Polygon**: Already configured
- **Ethereum Sepolia**: Ready to configure

## Setup Instructions

### 1. Configure Your Sepolia Contract

Update `networks.json` with your Sepolia contract details:

```json
{
  "polygon": {
    "Contract": {
      "address": "0x599559Ed394ADd1117ab72667e49d1560A2124E0",
      "startBlock": 61328490
    }
  },
  "sepolia": {
    "Contract": {
      "address": "YOUR_SEPOLIA_CONTRACT_ADDRESS",
      "startBlock": "YOUR_SEPOLIA_START_BLOCK"
    }
  }
}
```

Replace:

- `YOUR_SEPOLIA_CONTRACT_ADDRESS` with your actual contract address on Sepolia
- `YOUR_SEPOLIA_START_BLOCK` with the block number where your contract was deployed

### 2. Generate Code and Build

```bash
# Generate types from schema
npm run codegen

# Build for specific networks
npm run build:polygon
npm run build:sepolia
```

### 3. Deploy to The Graph Studio

Create separate subgraphs for each network:

1. **Create subgraphs in The Graph Studio:**

   - `depositContract-polygon` for Polygon
   - `depositContract-sepolia` for Sepolia

2. **Deploy:**

   ```bash
   # Deploy to Polygon
   npm run deploy:polygon

   # Deploy to Sepolia
   npm run deploy:sepolia
   ```

### 4. Querying Multi-Chain Data

With the updated schema, you can now distinguish between chains:

```graphql
# Query deposits from both chains
{
  depositEvents(orderBy: blockTimestamp, orderDirection: desc) {
    id
    user
    amount
    chain
    blockTimestamp
    transactionHash
  }
}

# Query deposits from specific chain (Sepolia)
{
  depositEvents(where: { chain: "sepolia" }, orderBy: blockTimestamp, orderDirection: desc) {
    id
    user
    amount
    chain
    blockTimestamp
    transactionHash
  }
}

# Query deposits from specific chain (Polygon)
{
  depositEvents(where: { chain: "polygon" }, orderBy: blockTimestamp, orderDirection: desc) {
    id
    user
    amount
    chain
    blockTimestamp
    transactionHash
  }
}
```

### 5. Frontend Integration

Update your frontend to query both subgraphs:

```typescript
const SUBGRAPH_URLS = {
  polygon: "https://api.studio.thegraph.com/query/YOUR_DEPLOYMENT_ID/depositContract-polygon/VERSION",
  sepolia: "https://api.studio.thegraph.com/query/YOUR_DEPLOYMENT_ID/depositContract-sepolia/VERSION",
};

// Query both chains
const queryMultipleChains = async () => {
  const promises = Object.entries(SUBGRAPH_URLS).map(async ([chain, url]) => {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: YOUR_GRAPHQL_QUERY }),
    });
    const data = await response.json();
    return { chain, data: data.data };
  });

  return await Promise.all(promises);
};
```

## Schema Updates

The schema now includes a `chain` field in both `DepositEvent` and `WithdrawalEvent` entities to identify which network the event originated from.

## Troubleshooting

1. **Linter errors after schema changes**: Run `npm run codegen` to regenerate types
2. **Deploy failures**: Ensure you've created the subgraphs in The Graph Studio first
3. **Network not found**: Verify the network name matches exactly in your `subgraph.yaml` and `networks.json`

## Alternative Approach: Single Subgraph with Multiple Data Sources

If you prefer a single subgraph with multiple data sources, update `subgraph.yaml`:

```yaml
specVersion: 1.0.0
indexerHints:
  prune: auto
schema:
  file: ./schema.graphql
dataSources:
  - kind: ethereum
    name: ContractPolygon
    network: polygon
    source:
      address: "0x599559Ed394ADd1117ab72667e49d1560A2124E0"
      abi: Contract
      startBlock: 61328490
    mapping:
      # ... existing mapping
  - kind: ethereum
    name: ContractSepolia
    network: sepolia
    source:
      address: "YOUR_SEPOLIA_CONTRACT_ADDRESS"
      abi: Contract
      startBlock: YOUR_SEPOLIA_START_BLOCK
    mapping:
      # ... same mapping as above
```

Note: This approach requires deploying to a network that supports both Polygon and Sepolia, which may not always be available.
