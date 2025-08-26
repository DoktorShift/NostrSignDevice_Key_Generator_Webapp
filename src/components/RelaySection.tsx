import React, { useState } from 'react';
import { Radio, CheckCircle, XCircle, Loader, Info, Globe } from 'lucide-react';
import { createProfileEvent, publishToMultipleRelays, sanitizeProfile } from '../utils/nostr';
import { DEFAULT_RELAYS } from '../constants/relays';
import type { NostrProfile, KeyPair, RelayStatus } from '../types/nostr';

interface RelaySectionProps {
  profile: NostrProfile;
  keys: KeyPair;
  onPublishComplete: () => void;
}

export default function RelaySection({ profile, keys, onPublishComplete }: RelaySectionProps) {
  const [relayStatuses, setRelayStatuses] = useState<RelayStatus[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishComplete, setPublishComplete] = useState(false);
  const [publishResults, setPublishResults] = useState<{ successful: number; total: number }>({
    successful: 0,
    total: 0,
  });

  const handlePublish = async () => {
    setIsPublishing(true);
    setRelayStatuses([]);

    // sanitize & build event
    const sanitized = sanitizeProfile(profile);
    const event = createProfileEvent(sanitized, keys);

    // seed statuses
    const seeded: RelayStatus[] = DEFAULT_RELAYS.map((url) => ({
      url,
      connected: false,
      published: false,
    }));
    setRelayStatuses(seeded);

    // publish
    const results = await publishToMultipleRelays(event, DEFAULT_RELAYS);

    // normalize
    const finalStatuses: RelayStatus[] = results.map((r) => ({
      url: r.url,
      connected: r.success,
      published: r.success,
      error: r.error,
    }));
    setRelayStatuses(finalStatuses);

    const successful = finalStatuses.filter((s) => s.published).length;
    setPublishResults({ successful, total: DEFAULT_RELAYS.length });

    setIsPublishing(false);
    setPublishComplete(true);

    // auto-advance
    setTimeout(() => onPublishComplete(), 3000);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-4xl mx-auto w-full">
        {/* Hero (single headline) */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-200 bg-gray-50">
            <Radio className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Going Live on Nostr</h1>
          <p className="text-gray-600 text-base max-w-2xl mx-auto mt-2">
            We’ll publish your profile to multiple relays so others can find and connect with you.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Step: Ready */}
          {!isPublishing && !publishComplete && (
            <div className="p-10 space-y-8 text-center">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto border border-gray-200 bg-gray-50">
                <Globe className="w-10 h-10 text-black" />
              </div>

              <p className="text-gray-700 max-w-xl mx-auto">
                Your profile will be shared across a set of independent servers (relays). This keeps your identity
                reachable, even if some relays go offline.
              </p>

              <div className="border border-gray-200 rounded-2xl p-6 text-left max-w-2xl mx-auto">
                <p className="text-sm font-semibold text-gray-900 mb-3">What happens next</p>
                <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-700">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center mr-2 bg-gray-100 border border-gray-200">
                      <span className="text-black text-xs font-bold">1</span>
                    </div>
                    <span>Profile gets published</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center mr-2 bg-gray-100 border border-gray-200">
                      <span className="text-black text-xs font-bold">2</span>
                    </div>
                    <span>You become discoverable</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center mr-2 bg-gray-100 border border-gray-200">
                      <span className="text-black text-xs font-bold">3</span>
                    </div>
                    <span>Start connecting</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePublish}
                className="inline-flex items-center justify-center rounded-xl px-10 py-4 font-semibold
                           text-white bg-black border border-black hover:bg-gray-900 transition-colors"
              >
                Publish My Profile
              </button>
            </div>
          )}

          {/* Step: Publishing */}
          {isPublishing && (
            <div className="p-10 space-y-8">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6">
                  <div className="w-20 h-20 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
                </div>
                <p className="text-lg font-semibold text-gray-900">Publishing your profile…</p>
                <p className="text-gray-600">Sharing your profile across the Nostr network</p>
              </div>

              <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <p className="font-medium text-gray-900 mb-4">Network status</p>
                  <div className="space-y-3">
                    {relayStatuses.map((status) => (
                      <div
                        key={status.url}
                        className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200"
                      >
                        <span className="text-sm font-mono text-gray-900 truncate">
                          {status.url.replace('wss://', '')}
                        </span>
                        <div className="flex items-center gap-2">
                          {status.published ? (
                            <>
                              <CheckCircle className="w-5 h-5 text-black" />
                              <span className="text-sm text-gray-800 font-medium">Published</span>
                            </>
                          ) : status.error ? (
                            <>
                              <XCircle className="w-5 h-5 text-red-600" />
                              <span className="text-sm text-red-600 font-medium">Failed</span>
                            </>
                          ) : (
                            <>
                              <Loader className="w-5 h-5 text-gray-700 animate-spin" />
                              <span className="text-sm text-gray-600 font-medium">Publishing…</span>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step: Complete */}
          {publishComplete && (
            <div className="p-10 text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto border border-gray-200 bg-gray-50">
                <CheckCircle className="w-8 h-8 text-black" />
              </div>

              <p className="text-2xl font-bold text-gray-900">You’re live on Nostr</p>
              <p className="text-gray-700">
                Successfully published to {publishResults.successful} of {publishResults.total} relays.
              </p>

              <p className="text-sm text-gray-500">Taking you to the final step…</p>
            </div>
          )}
        </div>

        {/* Info footer (only while not complete) */}
        {!publishComplete && (
          <div className="mt-8 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-black mt-0.5" />
              <p className="text-sm text-gray-700">
                Nostr uses multiple independent servers (“relays”) to store and share your content. Publishing to several
                relays helps keep your profile reachable even when some relays are offline.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
