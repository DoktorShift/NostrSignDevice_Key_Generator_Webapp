export interface NostrProfile {
  name?: string;
  display_name?: string;
  about?: string;
  picture?: string;
  banner?: string;
  website?: string;
  lud16?: string;
  nip05?: string;
}

export interface NostrEvent {
  id: string;
  pubkey: string;
  created_at: number;
  kind: number;
  tags: string[][];
  content: string;
  sig: string;
}

export interface RelayStatus {
  url: string;
  connected: boolean;
  published: boolean;
  error?: string;
}

export interface KeyPair {
  privateKey: string;
  publicKey: string;
  nsec: string;
  npub: string;
  mnemonic?: string;
}

export type AppMode = 'simple' | 'pro';
export type AppStep = 'welcome' | 'keys' | 'backup' | 'profile' | 'summary' | 'relays' | 'success';