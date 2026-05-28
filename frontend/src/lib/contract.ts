export const LOREKEEPER_ADDRESS = (
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
  "0x0000000000000000000000000000000000000000"
) as `0x${string}`;

export const LOREKEEPER_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "contributor", type: "address" },
      { indexed: false, internalType: "string", name: "sentence", type: "string" },
      { indexed: false, internalType: "uint256", name: "index", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" },
    ],
    name: "SentenceAdded",
    type: "event",
  },
  {
    inputs: [{ internalType: "string", name: "sentence", type: "string" }],
    name: "addSentence",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllEntries",
    outputs: [
      {
        components: [
          { internalType: "address", name: "contributor", type: "address" },
          { internalType: "string", name: "sentence", type: "string" },
          { internalType: "uint256", name: "timestamp", type: "uint256" },
          { internalType: "uint256", name: "index", type: "uint256" },
        ],
        internalType: "struct LoreKeeper.StoryEntry[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getEntryCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "index", type: "uint256" }],
    name: "getEntry",
    outputs: [
      { internalType: "address", name: "contributor", type: "address" },
      { internalType: "string", name: "sentence", type: "string" },
      { internalType: "uint256", name: "timestamp", type: "uint256" },
      { internalType: "uint256", name: "entryIndex", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "resetStory",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
