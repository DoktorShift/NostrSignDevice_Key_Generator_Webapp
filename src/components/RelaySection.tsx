import React, { useState } from 'react';
import { Radio, CheckCircle, XCircle, Loader, Info, Zap, Globe } from 'lucide-react';
import { createProfileEvent, publishToMultipleRelays, sanitizeProfile } from '../utils/nostr';
import { nip19 } from 'nostr-tools';
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
  const [publishResults, setPublishResults] = useState<{ successful: number; total: number }>({ successful: 0, total: 0 });

  const handlePublish = async () => {
    setIsPublishing(true);
    setRelayStatuses([]);
    
    // Sanitize profile data before creating event
    const sanitizedProfile = sanitizeProfile(profile);
    const event = createProfileEvent(sanitizedProfile, keys);
    
    const statuses: RelayStatus[] = DEFAULT_RELAYS.map(url => ({
      url,
      connected: false,
      published: false
    }));
    
    setRelayStatuses([...statuses]);

    // Publish to all relays
    const results = await publishToMultipleRelays(event, DEFAULT_RELAYS);
    
    // Update status based on results
    const finalStatuses = results.map(result => ({
      url: result.url,
      connected: result.success,
      published: result.success,
      error: result.error
    }));
    
    setRelayStatuses(finalStatuses);
    
    const successful = finalStatuses.filter(s => s.published).length;
    setPublishResults({ successful, total: DEFAULT_RELAYS.length });
    
    setIsPublishing(false);
    setPublishComplete(true);
    
    // Auto-advance after successful publish
    setTimeout(() => {
      onPublishComplete();
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50/30 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto w-full">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-slate-800 to-black rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl border border-slate-300/30">
            <Radio className="w-10 h-10 text-white drop-shadow-lg" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-black via-slate-800 to-black bg-clip-text text-transparent mb-4">
            Going Live on Nostr
          </h1>
          <p className="text-slate-700 text-lg max-w-2xl mx-auto">
            We'll publish your profile to the Nostr network so others can find and connect with you.
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 overflow-hidden">
          {!isPublishing && !publishComplete && (
            <div className="p-10 text-center space-y-8">
              <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl flex items-center justify-center mx-auto">
                <Globe className="w-12 h-12 text-black" />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-black mb-4">Ready to Join the Network?</h3>
                <p className="text-slate-700 text-lg mb-6 max-w-lg mx-auto">
                  Your profile will be shared across multiple Nostr servers worldwide, 
                  making you discoverable to millions of users.
                </p>
                
                <div className="bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 border border-slate-300/30 rounded-2xl p-6 mb-8 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  <div className="relative z-10">
                    <h4 className="font-bold text-black mb-3">What happens next:</h4>
                    <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-700">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gradient-to-br from-slate-800 to-black rounded-full flex items-center justify-center mr-2 shadow-lg border border-slate-300/30">
                          <span className="text-white font-bold text-xs">1</span>
                        </div>
                        <span>Profile gets published</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gradient-to-br from-slate-800 to-black rounded-full flex items-center justify-center mr-2 shadow-lg border border-slate-300/30">
                          <span className="text-white font-bold text-xs">2</span>
                        </div>
                        <span>You become discoverable</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gradient-to-br from-slate-800 to-black rounded-full flex items-center justify-center mr-2 shadow-lg border border-slate-300/30">
                          <span className="text-white font-bold text-xs">3</span>
                        </div>
                        <span>Start connecting!</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handlePublish}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-12 py-5 rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all duration-200"
              >
                Publish My Profile
              </button>
            </div>
          )}

          {isPublishing && (
            <div className="p-10 space-y-8">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6">
                  <div className="w-20 h-20 border-4 border-slate-200 border-t-green-600 rounded-full animate-spin"></div>
                </div>
                <h3 className="text-2xl font-bold text-black mb-2">Publishing Your Profile...</h3>
                <p className="text-slate-700">Sharing your profile across the Nostr network</p>
              </div>
              
              <div className="max-w-2xl mx-auto">
                <div className="bg-slate-50 rounded-2xl p-6">
                  <h4 className="font-semibold text-black mb-4">Network Status</h4>
                  <div className="space-y-3">
                    {relayStatuses.map((status, index) => (
                      <div key={status.url} className="flex items-center justify-between p-3 bg-white rounded-xl border">
                        <div className="flex-1">
                          <span className="text-sm font-mono text-black truncate block">
                            {status.url.replace('wss://', '')}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {status.published ? (
                            <>
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <span className="text-sm text-green-600 font-medium">Published</span>
                            </>
                          ) : status.error ? (
                            <>
                              <XCircle className="w-5 h-5 text-red-500" />
                              <span className="text-sm text-red-600 font-medium">Failed</span>
                            </>
                          ) : (
                            <>
                              <Loader className="w-5 h-5 text-green-500 animate-spin" />
                              <span className="text-sm text-slate-600 font-medium">Publishing...</span>
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

          {publishComplete && (
            <div className="p-10 text-center space-y-8">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                <CheckCircle className="w-12 h-12 text-white drop-shadow-lg" />
              </div>
              
              <div>
                <h3 className="text-3xl font-bold text-black mb-4">
                  🎉 You're Live on Nostr!
                </h3>
                <p className="text-slate-700 text-lg mb-6">
                  Successfully published to {publishResults.successful} of {publishResults.total} servers
                </p>
                
                <div className="bg-green-50 border border-green-200 rounded-2xl p-6 max-w-lg mx-auto">
                  <h4 className="font-bold text-black mb-3">Your profile is now:</h4>
                  <div className="text-sm text-slate-700 space-y-2">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      <span>Visible across the Nostr network</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      <span>Discoverable by other users</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      <span>Ready for connections and interactions</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-slate-500">
                Taking you to the final step...
              </p>
            </div>
          )}
        </div>

        {!publishComplete && (
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-3xl p-6 shadow-lg">
            <div className="flex items-start space-x-4">
              <Info className="w-6 h-6 text-black mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-black mb-2">About Nostr Servers</h4>
                <p className="text-slate-700 text-sm leading-relaxed">
                  Nostr uses multiple independent servers (called relays) to store and share your content. 
                  This ensures your profile stays accessible even if some servers go offline.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}