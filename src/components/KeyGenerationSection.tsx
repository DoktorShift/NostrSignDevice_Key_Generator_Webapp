import React, { useState } from 'react';
import { Key, Shield, ArrowRight, Sparkles, Lock, Globe } from 'lucide-react';
import { generateKeyPair } from '../utils/nostr';
import type { KeyPair } from '../types/nostr';

interface KeyGenerationSectionProps {
  onKeysGenerated: (keys: KeyPair) => void;
}

export default function KeyGenerationSection({ onKeysGenerated }: KeyGenerationSectionProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCreate = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    const newKeys = generateKeyPair(false);
    onKeysGenerated(newKeys);
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        {!isGenerating ? (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="p-10 text-center">
              <div className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center border border-gray-200 bg-gray-50">
                <Key className="w-7 h-7 text-black" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Generate Your Identity</h1>
              <p className="text-gray-500 mt-2">Create your secure cryptographic keys</p>
            </div>

            {/* Feature chips */}
            <div className="px-8 pb-8">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center p-4 rounded-xl border border-gray-200 bg-white shadow-sm">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mr-3 bg-gray-100 border border-gray-200">
                    <Shield className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">Bank-Grade Security</h3>
                    <p className="text-gray-500 text-xs">Military encryption</p>
                  </div>
                </div>

                <div className="flex items-center p-4 rounded-xl border border-gray-2 00 bg-white shadow-sm">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mr-3 bg-gray-100 border border-gray-200">
                    <Lock className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">Zero Knowledge</h3>
                    <p className="text-gray-500 text-xs">We never see your keys</p>
                  </div>
                </div>

                <div className="flex items-center p-4 rounded-xl border border-gray-200 bg-white shadow-sm">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mr-3 bg-gray-100 border border-gray-200">
                    <Globe className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">Global Access</h3>
                    <p className="text-gray-500 text-xs">Works everywhere</p>
                  </div>
                </div>
              </div>

              {/* What you get */}
              <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-gray-700" />
                  What You'll Get
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-black mr-3"></span>
                      Public key (npub) – your identity
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-black mr-3"></span>
                      Private key (nsec) – your signature
                    </li>
                  </ul>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-black mr-3"></span>
                      Instant global recognition
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-black mr-3"></span>
                      Cross-platform compatibility
                    </li>
                  </ul>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center mt-8">
                <button
                  onClick={handleCreate}
                  className="group inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 font-semibold
                             text-white bg-black hover:bg-gray-900 transition-colors border border-black shadow-sm"
                >
                  Generate My Keys
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
                </button>
                <p className="text-gray-400 text-sm mt-3">Takes less than 2 seconds</p>
              </div>
            </div>
          </div>
        ) : (
          // Loading state (light, with black accents)
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-12 text-center">
            <div className="space-y-6">
              <div className="relative w-20 h-20 mx-auto">
                <div className="w-20 h-20 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Key className="w-8 h-8 text-black" />
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Generating Your Keys</h2>
                <p className="text-gray-500">Creating your secure digital identity…</p>
              </div>

              <div className="rounded-xl p-4 max-w-md mx-auto border border-gray-200 bg-gray-50">
                <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-black rounded-full mr-2 animate-pulse"></span>
                    Generating keys
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
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
