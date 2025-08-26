import React, { useState } from 'react';
import { CheckCircle, User, Key, Shield, ArrowRight, RotateCcw, Copy, Eye, EyeOff, Globe, Zap, AtSign, Info, Star } from 'lucide-react';
import type { KeyPair, NostrProfile } from '../types/nostr';

interface SummarySectionProps {
  keys: KeyPair;
  profile: NostrProfile;
  onNext: () => void;
  onStartOver: () => void;
}

export default function SummarySection({ keys, profile, onNext, onStartOver }: SummarySectionProps) {
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50/30 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-slate-800 to-black rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl border border-slate-300/30">
            <CheckCircle className="w-10 h-10 text-white drop-shadow-lg" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-black via-slate-800 to-black bg-clip-text text-transparent mb-4">
            Everything Looks Great!
          </h1>
          <p className="text-slate-700 text-lg max-w-2xl mx-auto leading-relaxed">
            Your Nostr identity is ready. Let's review everything before going live.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Profile Summary */}
          <div className="space-y-8">
            {/* Profile Preview */}
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200/50">
              <div className="h-24 bg-gradient-to-r from-green-400 to-emerald-500 relative">
                {profile.banner && (
                  <img 
                    src={profile.banner} 
                    alt="Banner" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              <div className="relative px-6 pb-6">
                <div className="absolute -top-8 left-6">
                  <div className="w-16 h-16 rounded-full border-4 border-white overflow-hidden bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-xl">
                    {profile.picture ? (
                      <img 
                        src={profile.picture} 
                        alt="Avatar" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <User className="w-8 h-8 text-white" />
                    )}
                  </div>
                </div>
                
                <div className="pt-10">
                  <h3 className="text-lg font-bold text-black mb-1">
                    {profile.display_name || profile.name || 'Anonymous User'}
                  </h3>
                  {profile.name && profile.display_name && (
                    <p className="text-slate-600 text-sm mb-2">@{profile.name}</p>
                  )}
                  {profile.about && (
                    <p className="text-slate-600 text-sm leading-relaxed mb-3 line-clamp-2">
                      {profile.about}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    {profile.website && (
                      <div className="flex items-center text-green-600 text-xs bg-green-50 px-2 py-1 rounded-lg border border-green-200">
                        <Globe className="w-3 h-3 mr-1" />
                        <span className="truncate max-w-24">{profile.website.replace(/^https?:\/\//, '')}</span>
                      </div>
                    )}
                    {profile.lud16 && (
                      <div className="flex items-center text-amber-600 text-xs bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                        <Zap className="w-3 h-3 mr-1" />
                        <span className="truncate max-w-24">{profile.lud16}</span>
                      </div>
                    )}
                    {profile.nip05 && (
                      <div className="flex items-center text-blue-600 text-xs bg-blue-50 px-2 py-1 rounded-lg border border-blue-200">
                        <AtSign className="w-3 h-3 mr-1" />
                        <span className="truncate max-w-24">{profile.nip05}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Setup Complete */}
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-slate-200/50">
              <h3 className="text-2xl font-bold text-black mb-6 flex items-center">
                <Star className="w-6 h-6 mr-3" />
                Setup Complete
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-green-50/50 rounded-2xl border border-green-100">
                  <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-black rounded-xl flex items-center justify-center mr-4 shadow-lg border border-slate-300/30">
                    <Key className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-black">Secure Keys Generated</h4>
                    <p className="text-slate-600 text-sm">Your digital identity is ready</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>

                <div className="flex items-center p-4 bg-green-50/50 rounded-2xl border border-green-100">
                  <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-black rounded-xl flex items-center justify-center mr-4 shadow-lg border border-slate-300/30">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-black">Keys Safely Backed Up</h4>
                    <p className="text-slate-600 text-sm">Your identity is secure</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>

                <div className="flex items-center p-4 bg-green-50/50 rounded-2xl border border-green-100">
                  <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-black rounded-xl flex items-center justify-center mr-4 shadow-lg border border-slate-300/30">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-black">Profile Created</h4>
                    <p className="text-slate-600 text-sm">Ready to represent you</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Keys & Actions */}
          <div className="space-y-8">
            {/* Keys Summary */}
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-slate-200/50">
              <h3 className="text-lg font-bold text-black mb-4 flex items-center">
                <Key className="w-5 h-5 mr-2" />
                Your Identity Keys
              </h3>
              
              <div className="space-y-4">
                {/* Public Key */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wider">
                    Public Key (Safe to Share)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={`${keys.npub.slice(0, 20)}...${keys.npub.slice(-12)}`}
                      readOnly
                      className="flex-1 p-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-700 font-mono text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => handleCopy(keys.npub, 'npub')}
                      className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      {copied === 'npub' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Private Key */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wider">
                    Private Key (Keep Secret!)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type={showPrivateKey ? 'text' : 'password'}
                      value={showPrivateKey ? keys.nsec : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}
                      readOnly
                      className="flex-1 p-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-700 font-mono text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => setShowPrivateKey(!showPrivateKey)}
                      className="p-3 bg-slate-500 hover:bg-slate-600 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      {showPrivateKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleCopy(keys.nsec, 'nsec')}
                      className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      {copied === 'nsec' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                <p className="text-green-700 text-xs flex items-center">
                  <Shield className="w-3 h-3 mr-2" />
                  Your keys are safely backed up and ready for use
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-slate-200/50">
              <h3 className="text-xl font-bold text-black mb-6">Ready to Go Live?</h3>
              
              <div className="space-y-4">
                <button
                  onClick={onNext}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center justify-center group"
                >
                  <span>Publish to Nostr Network</span>
                  <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
                
                <button
                  onClick={onStartOver}
                  className="w-full bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-300 hover:border-slate-400 py-3 px-6 rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center group"
                >
                  <RotateCcw className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-300" />
                  Start Over with New Identity
                </button>
              </div>
            </div>

            {/* Security Reminder */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-6 shadow-lg">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-slate-800 to-black rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 shadow-lg border border-slate-300/30">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-black mb-2">Final Security Reminder</h4>
                  <div className="text-slate-700 text-sm space-y-1">
                    <p>• Your private key is your only way to access this identity</p>
                    <p>• Keep multiple secure backups in different locations</p>
                    <p>• Never share your private key with anyone</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}