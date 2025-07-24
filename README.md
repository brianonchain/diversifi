# Introduction

DiversiFi DApp is a test DApp where users can deposit/withdraw USDC on the networks Ethereum Sepolia and Polygon. The DApp showcases a user-friendly UI for approve & transfer, interactive line charts, and a transaction history UI powered by The Graph.

Visit https://diversifi.vercel.app/ to test it out!

# Contract Addresses

Polygon: 0x599559Ed394ADd1117ab72667e49d1560A2124E0<br>
Sepolia: 0xd8d86fe48323Cd4A630cef4f7825fCB22dEF94E9

# NextJS Data Fetching

Vault description and details are fetched from an external database using Next.js's unstable_cache in the page.tsx Server Component. This allows immediate loading of the Vault Description and fewer queries to the database.

User-specific data (balances, tx history, etc.) are fetched on the client-side using React Query.
