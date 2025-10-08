import React, { useState } from 'react';
import { Shield, Zap, Globe, ArrowRight, Users, Key, Radio, Info, X, HelpCircle } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

interface WelcomeSectionProps {
  onNext: () => void;
}

export default function WelcomeSection({ onNext }: WelcomeSectionProps) {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  React.useEffect(() => {
    const handleStartAccountCreation = () => {
      handleGetStarted();
    };

    window.addEventListener('startAccountCreation', handleStartAccountCreation);
    return () => {
      window.removeEventListener('startAccountCreation', handleStartAccountCreation);
    };
  }, []);

  const handleGetStarted = () => {
    setShowWelcomeModal(true);
  };

  const handleContinue = () => {
    setShowWelcomeModal(false);
    onNext();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-white to-gray-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0,0,0) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}></div>
      </div>

      <Header />

      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-8 mb-16">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-purple-50 border border-purple-200 rounded-full text-purple-700 text-sm font-medium mb-4">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></div>
                Hardware-grade security for your Nostr identity
              </div>

              <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-gray-900 bg-clip-text text-transparent leading-tight">
                Setup Your
                <br />
                <span className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                  Nostr Signing Device
                </span>
              </h1>

              <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-light">
                Generate a fresh Nostr identity for your hardware signing device. Publish your profile to the network and keep your keys secured on dedicated hardware.
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleGetStarted}
                className="group relative bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white px-12 py-5 rounded-2xl font-semibold text-xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 flex items-center mx-auto overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="relative">Setup Device Identity</span>
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300 relative" />
              </button>

              <div className="flex items-center justify-center space-x-6 text-sm text-slate-500">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-1 text-slate-700" />
                  Hardware Secured
                </div>
                <div className="flex items-center">
                  <Zap className="w-4 h-4 mr-1 text-slate-700" />
                  5 Minutes Setup
                </div>
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-1 text-slate-700" />
                  NIP-46 Protocol
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/50 max-w-4xl mx-auto relative">
            <div className="absolute top-6 right-6">
              <button
                onMouseEnter={() => setShowTooltip('nostr-info')}
                onMouseLeave={() => setShowTooltip(null)}
                className="relative p-2 text-slate-400 hover:text-purple-600 transition-colors"
              >
                <HelpCircle className="w-5 h-5" />
                {showTooltip === 'nostr-info' && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-slate-900 text-white text-xs rounded-xl p-3 shadow-xl z-20">
                    <div className="absolute -top-1 right-4 w-2 h-2 bg-slate-900 rotate-45"></div>
                    The Nostr Signing Device is a hardware remote signer implementing NIP-46 protocol for secure event signing with ESP32-S3 touchscreen.
                  </div>
                )}
              </button>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                What is the Nostr Signing Device?
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed max-w-2xl mx-auto">
                A dedicated hardware device implementing NIP-46 protocol for secure Nostr event signing. Your keys never leave the device, ensuring maximum security for your digital identity.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="group text-center p-6 rounded-2xl hover:bg-purple-50/50 transition-all duration-300">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-700 to-purple-900 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-2xl border border-purple-300/30 group-hover:shadow-3xl group-hover:scale-105 group-hover:border-purple-400/50 transition-all duration-300 backdrop-blur-sm">
                    <Key className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                  <button
                    onMouseEnter={() => setShowTooltip('keys')}
                    onMouseLeave={() => setShowTooltip(null)}
                    className="absolute -top-1 -right-1 p-1 text-slate-400 hover:text-purple-600 transition-colors"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                  {showTooltip === 'keys' && (
                    <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 w-56 bg-slate-900 text-white text-xs rounded-xl p-3 shadow-xl z-20">
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                      Hardware signing devices keep your private keys completely isolated from the internet and potential threats.
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-slate-800 mb-3 text-lg">Hardware Key Storage</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Your private keys are stored securely on the dedicated hardware device, never exposed to computers or networks.
                </p>
              </div>

              <div className="group text-center p-6 rounded-2xl hover:bg-purple-50/50 transition-all duration-300">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-700 to-purple-900 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-2xl border border-purple-300/30 group-hover:shadow-3xl group-hover:scale-105 group-hover:border-purple-400/50 transition-all duration-300 backdrop-blur-sm">
                    <Radio className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                  <button
                    onMouseEnter={() => setShowTooltip('decentralized')}
                    onMouseLeave={() => setShowTooltip(null)}
                    className="absolute -top-1 -right-1 p-1 text-slate-400 hover:text-purple-600 transition-colors"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                  {showTooltip === 'decentralized' && (
                    <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 w-56 bg-slate-900 text-white text-xs rounded-xl p-3 shadow-xl z-20">
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                      The device implements NIP-46 (Nostr Connect) for secure remote signing without exposing keys.
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-slate-800 mb-3 text-lg">NIP-46 Protocol</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Uses the Nostr Connect protocol to sign events remotely while keeping your keys safely on the hardware.
                </p>
              </div>

              <div className="group text-center p-6 rounded-2xl hover:bg-purple-50/50 transition-all duration-300">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-700 to-purple-900 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-2xl border border-purple-300/30 group-hover:shadow-3xl group-hover:scale-105 group-hover:border-purple-400/50 transition-all duration-300 backdrop-blur-sm">
                    <Users className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                  <button
                    onMouseEnter={() => setShowTooltip('interoperable')}
                    onMouseLeave={() => setShowTooltip(null)}
                    className="absolute -top-1 -right-1 p-1 text-slate-400 hover:text-purple-600 transition-colors"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                  {showTooltip === 'interoperable' && (
                    <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 w-56 bg-slate-900 text-white text-xs rounded-xl p-3 shadow-xl z-20">
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                      The device requires manual approval for each connection and signing request, putting you in full control.
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-slate-800 mb-3 text-lg">Manual Authorization</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Touchscreen interface for approving applications and signing requests. Full control in your hands.
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <div className="flex justify-center space-x-8 text-sm">
                <a
                  href="https://github.com/lnbits/nsec-remote-signer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group text-slate-600 hover:text-purple-600 font-medium flex items-center transition-colors"
                >
                  View device documentation
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="https://github.com/nostr-protocol/nips/blob/master/46.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group text-slate-600 hover:text-purple-600 font-medium flex items-center transition-colors"
                >
                  Learn about NIP-46
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 mb-16 max-w-2xl mx-auto">
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-900 via-black to-purple-900 border border-purple-700 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)`,
                  }}></div>
                </div>
                <div className="flex items-start space-x-4 relative z-10">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center mt-1 flex-shrink-0 shadow-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white mb-2 text-lg">Why This Setup Tool?</h4>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      This tool helps you generate a fresh Nostr identity and publish your initial profile to the network. Once created, transfer your keys to your Nostr Signing Device for maximum security.
                    </p>
                    <a
                      href="https://github.com/lnbits/nsec-remote-signer"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      Get the Hardware Device
                    </a>
                    <div className="mt-3 flex items-center text-sm text-gray-400">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                      ESP32-S3 touchscreen • NIP-46 protocol • Open source
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showWelcomeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-200/50 transform animate-in fade-in duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Key className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-3">Ready to Get Started?</h3>
              <p className="text-slate-700 mb-6 leading-relaxed">
                We'll guide you through creating a Nostr identity for your hardware device. The entire process takes about 5 minutes.
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-slate-700">
                  <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-black font-bold text-xs">1</span>
                  </div>
                  Generate your cryptographic keys
                </div>
                <div className="flex items-center text-sm text-slate-700">
                  <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-black font-bold text-xs">2</span>
                  </div>
                  Create and publish your profile
                </div>
                <div className="flex items-center text-sm text-slate-700">
                  <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-black font-bold text-xs">3</span>
                  </div>
                  Transfer keys to your device
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowWelcomeModal(false)}
                  className="flex-1 px-4 py-3 border border-slate-400 text-slate-800 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                >
                  Maybe Later
                </button>
                <button
                  onClick={handleContinue}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center"
                >
                  Let's Go!
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
