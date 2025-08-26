import React, { useState } from 'react';
import {
  CheckCircle, User, Key, Shield, ArrowRight, RotateCcw, Copy, Eye, EyeOff, Globe, Zap, AtSign, Lock
} from 'lucide-react';
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

  const hasProfileData = Object.values(profile).some(v => typeof v === 'string' && v.trim() !== '');

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-5xl mx-auto w-full">
        {/* Hero */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-200 bg-gray-50">
            <CheckCircle className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Review & Go Live</h1>
          <p className="text-gray-600 text-base mt-2">Quick review of your identity before publishing.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-200">
              {/* Banner */}
              <div className="h-20 relative bg-gray-100">
                {profile.banner && (
                  <img
                    src={profile.banner}
                    alt="Banner"
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                )}
              </div>

              {/* Content */}
              <div className="relative px-5 pb-5">
                <div className="absolute -top-6 left-5">
                  <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-gray-200 flex items-center justify-center shadow">
                    {profile.picture ? (
                      <img
                        src={profile.picture}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                      />
                    ) : (
                      <User className="w-6 h-6 text-black" />
                    )}
                  </div>
                </div>

                <div className="pt-8">
                  <p className="font-semibold text-gray-900">
                    {profile.display_name || profile.name || 'Anonymous User'}
                  </p>
                  {profile.name && profile.display_name && (
                    <p className="text-gray-600 text-sm mb-2">@{profile.name}</p>
                  )}
                  {profile.about && (
                    <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-3">{profile.about}</p>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {profile.website && (
                      <div className="flex items-center text-gray-800 text-xs bg-gray-100 px-2 py-1 rounded-md border border-gray-200 hover:border-gray-300">
                        <Globe className="w-3 h-3 mr-1" />
                        <span className="truncate max-w-20">{profile.website.replace(/^https?:\/\//, '')}</span>
                      </div>
                    )}
                    {profile.lud16 && (
                      <div className="flex items-center text-gray-800 text-xs bg-gray-100 px-2 py-1 rounded-md border border-gray-200 hover:border-gray-300">
                        <Zap className="w-3 h-3 mr-1" />
                        <span className="truncate max-w-20">{profile.lud16}</span>
                      </div>
                    )}
                    {profile.nip05 && (
                      <div className="flex items-center text-gray-800 text-xs bg-gray-100 px-2 py-1 rounded-md border border-gray-200 hover:border-gray-300">
                        <AtSign className="w-3 h-3 mr-1" />
                        <span className="truncate max-w-20">{profile.nip05}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Status Indicators */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center p-3 bg-white rounded-xl border border-gray-200">
                <CheckCircle className="w-5 h-5 text-black mr-3" />
                <div>
                  <p className="font-medium text-gray-900 text-sm">Keys Generated</p>
                  <p className="text-gray-600 text-xs">Identity secured</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-white rounded-xl border border-gray-200">
                <CheckCircle className="w-5 h-5 text-black mr-3" />
                <div>
                  <p className="font-medium text-gray-900 text-sm">Backup Complete</p>
                  <p className="text-gray-600 text-xs">Keys safely stored</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-white rounded-xl border border-gray-200">
                <CheckCircle className="w-5 h-5 text-black mr-3" />
                <div>
                  <p className="font-medium text-gray-900 text-sm">Profile Ready</p>
                  <p className="text-gray-600 text-xs">{hasProfileData ? 'Customized' : 'Basic setup'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Keys & Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Identity Keys */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
              <div className="flex items-center mb-4">
                <Key className="w-5 h-5 mr-2 text-black" />
                <p className="text-base font-semibold text-gray-900">Your Identity Keys</p>
              </div>

              <div className="space-y-4">
                {/* Public Key */}
                <div className="rounded-xl p-4 border border-gray-200 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 bg-gray-100 border border-gray-200">
                        <Eye className="w-4 h-4 text-black" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Public Key</p>
                        <p className="text-gray-600 text-xs">Safe to share</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopy(keys.npub, 'npub')}
                      className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 hover:border-green-500 hover:text-green-700 transition-colors"
                      title="Copy public key"
                    >
                      {copied === 'npub' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={keys.npub}
                    readOnly
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 font-mono text-xs
                               focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
                  />
                </div>

                {/* Private Key */}
                <div className="rounded-xl p-4 border border-gray-200 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 bg-gray-100 border border-gray-200">
                        <Lock className="w-4 h-4 text-black" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Private Key</p>
                        <p className="text-gray-600 text-xs">Keep secret</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowPrivateKey(!showPrivateKey)}
                        className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
                        title={showPrivateKey ? 'Hide private key' : 'Show private key'}
                      >
                        {showPrivateKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleCopy(keys.nsec, 'nsec')}
                        className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 hover:border-green-500 hover:text-green-700 transition-colors"
                        title="Copy private key"
                      >
                        {copied === 'nsec' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <input
                    type={showPrivateKey ? 'text' : 'password'}
                    value={keys.nsec}
                    readOnly
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 font-mono text-xs
                               focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
              <p className="text-base font-semibold text-gray-900 mb-4">Publish to Network</p>

              <div className="space-y-3">
                <button
                  onClick={onNext}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl py-4 px-6 font-semibold
                             text-white bg-black border border-black hover:bg-green-600 hover:border-green-600 transition-colors group"
                >
                  Go Live on Nostr
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={onStartOver}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl py-3 px-6 font-medium
                             text-gray-800 bg-white border-2 border-gray-300 hover:border-green-600 hover:text-green-700 transition-colors group"
                >
                  <RotateCcw className="w-4 h-4 transition-transform group-hover:-rotate-180" />
                  Start Over
                </button>
              </div>
            </div>

            {/* Security Reminder */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-black mt-0.5" />
                <p className="text-sm text-gray-700">
                  Your private key is the only way to access this identity. Keep it secure and never share it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
