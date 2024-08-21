export interface ApiCommunity {
  id: number;
  subdomain: string;
  template: string;
  polkadot_reference_id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}
