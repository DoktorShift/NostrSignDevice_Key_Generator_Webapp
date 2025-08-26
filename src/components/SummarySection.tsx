import React, { useState } from 'react';
import { CheckCircle, User, Key, Shield, ArrowRight, RotateCcw, Copy, Eye, EyeOff, Globe, Zap, AtSign, Star, Lock } from 'lucide-react';
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

  const hasProfileData = Object.values(profile).some(value => value && value.trim() !== '');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50/30 flex items-center justify-center p-4">
      <div className="max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <CheckCircle className="w-8 h-8 text-white drop-shadow-lg" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Ready to Go Live</h1>
          <p className="text-slate-600 text-lg">Review your identity before publishing to the network</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl overflow-hidden shadow-xl border border-slate-200/50">
              {/* Profile Header */}
              <div className="h-20 bg-gradient-to-r from-green-400 to-emerald-500 relative">
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
              
              {/* Profile Content */}
              <div className="relative px-5 pb-5">
                <div className="absolute -top-6 left-5">
                  <div className="w-12 h-12 rounded-full border-3 border-white overflow-hidden bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg">
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
                      <User className="w-6 h-6 text-white" />
                    )}
                  </div>
                </div>
                
                <div className="pt-8">
                  <h3 className="font-bold text-slate-900 mb-1">
                    {profile.display_name || profile.name || 'Anonymous User'}
                  </h3>
                  {profile.name && profile.display_name && (
                    <p className="text-slate-600 text-sm mb-2">@{profile.name}</p>
                  )}
                  {profile.about && (
                    <p className="text-slate-600 text-sm leading-relaxed mb-3 line-clamp-3">
                      {profile.about}
                    </p>
                  )}
                  
                  {/* Profile Tags */}
                  <div className="flex flex-wrap gap-1">
                    {profile.website && (
                      <div className="flex items-center text-green-600 text-xs bg-green-50 px-2 py-1 rounded-md border border-green-200">
                        <Globe className="w-3 h-3 mr-1" />
                        <span className="truncate max-w-20">{profile.website.replace(/^https?:\/\//, '')}</span>
                      </div>
                    )}
                    {profile.lud16 && (
                      <div className="flex items-center text-amber-600 text-xs bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                        <Zap className="w-3 h-3 mr-1" />
                        <span className="truncate max-w-20">{profile.lud16}</span>
                      </div>
                    )}
                    {profile.nip05 && (
                      <div className="flex items-center text-blue-600 text-xs bg-blue-50 px-2 py-1 rounded-md border border-blue-200">
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
              <div className="flex items-center p-3 bg-green-50 rounded-xl border border-green-200">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <div>
                  <h4 className="font-semibold text-green-800 text-sm">Keys Generated</h4>
                  <p className="text-green-600 text-xs">Identity secured</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-green-50 rounded-xl border border-green-200">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <div>
                  <h4 className="font-semibold text-green-800 text-sm">Backup Complete</h4>
                  <p className="text-green-600 text-xs">Keys safely stored</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-green-50 rounded-xl border border-green-200">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <div>
                  <h4 className="font-semibold text-green-800 text-sm">Profile Ready</h4>
                  <p className="text-green-600 text-xs">{hasProfileData ? 'Customized' : 'Basic setup'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Keys & Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Identity Keys */}
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-slate-200/50">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <Key className="w-5 h-5 mr-2" />
                Your Identity Keys
              </h3>
              
              <div className="space-y-4">
                {/* Public Key */}
                <div className="bg-green-50/50 rounded-xl p-4 border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3 shadow-lg">
                        <Eye className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm">Public Key</h4>
                        <p className="text-green-700 text-xs">Safe to share</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopy(keys.npub, 'npub')}
                      className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      {copied === 'npub' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={keys.npub}
                    readOnly
                    className="w-full p-2 border border-green-300 rounded-lg bg-white text-slate-800 font-mono text-xs focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Private Key */}
                <div className="bg-red-50/50 rounded-xl p-4 border border-red-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center mr-3 shadow-lg">
                        <Lock className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm">Private Key</h4>
                        <p className="text-red-700 text-xs">Keep secret!</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setShowPrivateKey(!showPrivateKey)}
                        className="p-2 bg-slate-500 hover:bg-slate-600 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        {showPrivateKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleCopy(keys.nsec, 'nsec')}
                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        {copied === 'nsec' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <input
                    type={showPrivateKey ? 'text' : 'password'}
                    value={showPrivateKey ? keys.nsec : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}
                    readOnly
                    className="w-full p-2 border border-red-300 rounded-lg bg-white text-slate-800 font-mono text-xs focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-slate-200/50">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Publish to Network</h3>
              
              <div className="space-y-3">
                <button
                  onClick={onNext}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center justify-center group"
                >
                  <span>Go Live on Nostr</span>
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
                
                <button
                  onClick={onStartOver}
                  className="w-full bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-300 hover:border-slate-400 py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center group"
                >
                  <RotateCcw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-300" />
                  Start Over
                </button>
              </div>
            </div>

            {/* Security Reminder */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 shadow-lg">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm mb-1">Security Reminder</h4>
                  <p className="text-slate-700 text-xs leading-relaxed">
                    Your private key is your only way to access this identity. Keep it secure and never share it with anyone.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}