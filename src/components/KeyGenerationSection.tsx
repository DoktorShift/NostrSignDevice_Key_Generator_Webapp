import React, { useState } from 'react';
import { Key, Shield, Zap, ArrowRight, Info, CheckCircle, AlertCircle } from 'lucide-react';
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
      <div className="max-w-2xl mx-auto w-full">
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl">
            <Key className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            Generate Your Identity
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Create your secure digital identity in seconds. Your keys, your control.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-12">
            {!isGenerating ? (
              <div className="text-center space-y-8">
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-slate-900">Ready to Get Started?</h2>
                  <p className="text-lg text-slate-600 max-w-lg mx-auto leading-relaxed">
                    Generate your cryptographic keys instantly. Secure, private, and completely under your control.
                  </p>
                  
                  <div className="flex justify-center space-x-8 text-sm text-slate-500">
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 mr-2 text-green-500" />
                      Secure
                    </div>
                    <div className="flex items-center">
                      <Zap className="w-4 h-4 mr-2 text-green-500" />
                      Instant
                    </div>
                    <div className="flex items-center">
                      <Key className="w-4 h-4 mr-2 text-green-500" />
                      Private
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCreate}
                  className="group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-6 px-12 rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center mx-auto"
                >
                  Generate My Keys
                  <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </div>
            ) : (
              <div className="text-center space-y-8">
                <div className="space-y-6">
                  <div className="w-20 h-20 mx-auto">
                    <div className="w-20 h-20 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900">Generating Your Keys...</h2>
                  <p className="text-lg text-slate-600 max-w-lg mx-auto">
                    Creating your secure digital identity
                  </p>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}