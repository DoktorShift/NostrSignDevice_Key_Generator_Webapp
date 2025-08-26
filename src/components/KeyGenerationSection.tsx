import React, { useState } from 'react';
import { Key, Shield, Zap, ArrowRight, Sparkles, Lock, Globe } from 'lucide-react';
import { generateKeyPair } from '../utils/nostr';
import type { KeyPair, AppMode } from '../types/nostr';

interface KeyGenerationSectionProps {
  onKeysGenerated: (keys: KeyPair) => void;
}

export default function KeyGenerationSection({ onKeysGenerated }: KeyGenerationSectionProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCreate = async () => {
    setIsGenerating(true);
    
    // Add a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newKeys = generateKeyPair(false);
    onKeysGenerated(newKeys);
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50/30 flex items-center justify-center p-4">
      <div className="max-w-3xl mx-auto w-full">
        {!isGenerating ? (
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-slate-800 to-black p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl border border-white/30">
                  <Key className="w-8 h-8 text-white drop-shadow-lg" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Generate Your Identity</h1>
                <p className="text-slate-200 text-lg">Create your secure cryptographic keys</p>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8">
              {/* Security Features */}
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="flex items-center p-4 bg-green-50/50 rounded-xl border border-green-100">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm">Bank-Grade Security</h3>
                    <p className="text-slate-600 text-xs">Military encryption</p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm">Zero Knowledge</h3>
                    <p className="text-slate-600 text-xs">We never see your keys</p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-purple-50/50 rounded-xl border border-purple-100">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm">Global Access</h3>
                    <p className="text-slate-600 text-xs">Works everywhere</p>
                  </div>
                </div>
              </div>

              {/* What You Get */}
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-6 mb-8 border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-slate-700" />
                  What You'll Get
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center text-slate-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span>Public key (npub) - your identity</span>
                    </div>
                    <div className="flex items-center text-slate-700">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                      <span>Private key (nsec) - your signature</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-slate-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span>Instant global recognition</span>
                    </div>
                    <div className="flex items-center text-slate-700">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                      <span>Cross-platform compatibility</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center">
                <button
                  onClick={handleCreate}
                  className="group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center mx-auto relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <span className="relative">Generate My Keys</span>
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-200 relative" />
                </button>
                <p className="text-slate-500 text-sm mt-3">Takes less than 2 seconds</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 p-12 text-center">
            <div className="space-y-6">
              <div className="relative">
                <div className="w-20 h-20 mx-auto">
                  <div className="w-20 h-20 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Key className="w-8 h-8 text-green-600" />
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Generating Your Keys</h2>
                <p className="text-slate-600">Creating your secure digital identity...</p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 max-w-md mx-auto">
                <div className="flex items-center justify-center space-x-4 text-sm text-slate-600">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    Generating keys
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-slate-300 rounded-full mr-2"></div>
                    Securing identity
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}