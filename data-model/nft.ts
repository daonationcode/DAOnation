export interface Bid {
  date: string;
  walletAddress: string;
  bidder: string;
  bidAmount: number;
}

export interface NFT {
  id: string;
  daoid?: number;
  eventid?: number;
  name: string;
  url: string;
  description: string;
  highest_amount?: number;
  highest_bidder?: number;
  highest_bidder_wallet?: string;
  highestBid: Bid;
  bidHistory: Bid[];
}
