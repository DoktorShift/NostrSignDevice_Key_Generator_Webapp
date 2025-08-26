import { generateSecretKey, getPublicKey } from 'nostr-tools/pure';
import { nip19 } from 'nostr-tools';
import * as nip06 from 'nostr-tools/nip06';
import { finalizeEvent, verifyEvent } from 'nostr-tools/pure';
import type { KeyPair, NostrProfile, NostrEvent } from '../types/nostr';

export function generateKeyPair(useMnemonic = false): KeyPair {
  try {
    if (useMnemonic) {
      const mnemonic = nip06.generateSeedWords();
      const privateKey = nip06.privateKeyFromSeedWords(mnemonic);
      const publicKey = getPublicKey(privateKey);
      
      return {
        privateKey: bytesToHex(privateKey),
        publicKey,
        nsec: nip19.nsecEncode(privateKey),
        npub: nip19.npubEncode(publicKey),
        mnemonic
      };
    }

    const privateKey = generateSecretKey();
    const publicKey = getPublicKey(privateKey);
    
    return {
      privateKey: bytesToHex(privateKey),
      publicKey,
      nsec: nip19.nsecEncode(privateKey),
      npub: nip19.npubEncode(publicKey)
    };
  } catch (error) {
    console.error('Error generating key pair:', error);
    throw new Error('Failed to generate key pair');
  }
}

export function importKeyPair(input: string): KeyPair | null {
  try {
    let privateKey: Uint8Array;
    let mnemonic: string | undefined;

    const trimmedInput = input.trim();

    if (trimmedInput.startsWith('nsec')) {
      const decoded = nip19.decode(trimmedInput);
      if (decoded.type !== 'nsec') throw new Error('Invalid nsec');
      privateKey = decoded.data;
    } else if (trimmedInput.length === 64 && /^[0-9a-fA-F]+$/.test(trimmedInput)) {
      privateKey = hexToBytes(trimmedInput);
    } else if (trimmedInput.split(' ').length >= 12) {
      // Mnemonic
      mnemonic = trimmedInput;
      const hexKey = nip06.privateKeyFromSeedWords(trimmedInput);
      privateKey = hexKey;
    } else {
      throw new Error('Invalid format');
    }

    const publicKey = getPublicKey(privateKey);
    
    return {
      privateKey: bytesToHex(privateKey),
      publicKey,
      nsec: nip19.nsecEncode(privateKey),
      npub: nip19.npubEncode(publicKey),
      mnemonic
    };
  } catch (error) {
    console.error('Import error:', error);
    return null;
  }
}

export function createProfileEvent(profile: NostrProfile, keyPair: KeyPair): NostrEvent {
  try {
    const content = JSON.stringify(sanitizeProfile(profile));
    const privateKey = hexToBytes(keyPair.privateKey);
    
    const event = finalizeEvent({
      kind: 0,
      created_at: Math.floor(Date.now() / 1000),
      tags: [],
      content
    }, privateKey);

    return event;
  } catch (error) {
    console.error('Error creating profile event:', error);
    throw new Error('Failed to create profile event');
  }
}

export async function publishToRelay(event: NostrEvent, relayUrl: string): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const ws = new WebSocket(relayUrl);
      let published = false;
      
      const timeout = setTimeout(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
        if (!published) resolve(false);
      }, 10000);
      
      ws.onopen = () => {
        ws.send(JSON.stringify(['EVENT', event]));
      };
      
      ws.onmessage = (msg) => {
        try {
          const data = JSON.parse(msg.data);
          const [type, eventId, success] = data;
          
          if (type === 'OK') {
            published = success;
            clearTimeout(timeout);
            ws.close();
            resolve(success);
          }
        } catch (e) {
          console.error('Error parsing relay message:', e);
          clearTimeout(timeout);
          ws.close();
          resolve(false);
        }
      };
      
      ws.onerror = () => {
        clearTimeout(timeout);
        resolve(false);
      };
      
      ws.onclose = () => {
        clearTimeout(timeout);
        if (!published) resolve(false);
      };
      
    } catch (error) {
      console.error('Error connecting to relay:', error);
      resolve(false);
    }
  });
}

export async function publishToMultipleRelays(event: NostrEvent, relayUrls: string[]): Promise<{ url: string; success: boolean; error?: string }[]> {
  const results: { url: string; success: boolean; error?: string }[] = [];
  
  const publishPromises = relayUrls.map(async (url) => {
    try {
      const success = await publishToRelay(event, url);
      return { url, success };
    } catch (error) {
      return { 
        url, 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  });
  
  const publishResults = await Promise.allSettled(publishPromises);
  
  publishResults.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      results.push(result.value);
    } else {
      results.push({
        url: relayUrls[index],
        success: false,
        error: result.reason?.message || 'Failed to publish'
      });
    }
  });
  
  return results;
}

export function validateRelayUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'wss:' || parsed.protocol === 'ws:';
  } catch {
    return false;
  }
}

export function sanitizeProfile(profile: NostrProfile): NostrProfile {
  const sanitized: NostrProfile = {};
  
  if (profile.name && typeof profile.name === 'string') {
    sanitized.name = profile.name.trim().slice(0, 50);
  }
  
  if (profile.display_name && typeof profile.display_name === 'string') {
    sanitized.display_name = profile.display_name.trim().slice(0, 100);
  }
  
  if (profile.about && typeof profile.about === 'string') {
    sanitized.about = profile.about.trim().slice(0, 500);
  }
  
  if (profile.picture && typeof profile.picture === 'string') {
    try {
      new URL(profile.picture);
      sanitized.picture = profile.picture.trim();
    } catch {
      // Invalid URL, skip
    }
  }
  
  if (profile.banner && typeof profile.banner === 'string') {
    try {
      new URL(profile.banner);
      sanitized.banner = profile.banner.trim();
    } catch {
      // Invalid URL, skip
    }
  }
  
  if (profile.website && typeof profile.website === 'string') {
    try {
      new URL(profile.website);
      sanitized.website = profile.website.trim();
    } catch {
      // Invalid URL, skip
    }
  }
  
  if (profile.lud16 && typeof profile.lud16 === 'string') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(profile.lud16.trim())) {
      sanitized.lud16 = profile.lud16.trim().toLowerCase();
    }
  }
  
  if (profile.nip05 && typeof profile.nip05 === 'string') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(profile.nip05.trim())) {
      sanitized.nip05 = profile.nip05.trim().toLowerCase();
    }
  }
  
  return sanitized;
}

export function validateEvent(event: NostrEvent): boolean {
  try {
    return verifyEvent(event);
  } catch {
    return false;
  }
}

// Helper functions for byte/hex conversion
function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}