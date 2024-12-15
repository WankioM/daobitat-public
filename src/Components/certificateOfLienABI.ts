import { InterfaceAbi } from 'ethers';

const CertificateOfLienABI: InterfaceAbi = [
  {
    inputs: [
      { internalType: "uint256", name: "landPrice", type: "uint256" },
      { internalType: "uint256", name: "period", type: "uint256" },
      { internalType: "uint256", name: "interestRate", type: "uint256" },
      { internalType: "uint256", name: "loanAmount", type: "uint256" }
    ],
    name: "createLien",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "invest",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "getLienDetails",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "landPrice", type: "uint256" },
          { internalType: "address", name: "borrower", type: "address" },
          { internalType: "address", name: "lender", type: "address" },
          { internalType: "uint256", name: "period", type: "uint256" },
          { internalType: "uint256", name: "interestRate", type: "uint256" },
          { internalType: "bool", name: "isActive", type: "bool" },
          { internalType: "uint256", name: "creationTime", type: "uint256" },
          { internalType: "uint256", name: "collateralAmount", type: "uint256" },
          { internalType: "uint256", name: "loanAmount", type: "uint256" }
        ],
        internalType: "struct CertificateOfLien.Lien",
        name: "",
        type: "tuple"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" },
      { indexed: true, internalType: "address", name: "borrower", type: "address" },
      { indexed: true, internalType: "address", name: "lender", type: "address" },
      { indexed: false, internalType: "uint256", name: "landPrice", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "period", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "interestRate", type: "uint256" }
    ],
    name: "LienCreated",
    type: "event"
  },
] as const;

export default CertificateOfLienABI;