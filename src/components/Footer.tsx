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

  // Listen for the custom event from header
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50/30 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0,0,0) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}></div>
      </div>

      <Header />
      
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="text-center space-y-8 mb-16">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-green-50 border border-green-200 rounded-full text-green-700 text-sm font-medium mb-4">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Trusted by 10,000+ users worldwide
              </div>
              
              <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-slate-900 via-green-800 to-slate-900 bg-clip-text text-transparent leading-tight">
                Own Your Digital
                <br />
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Identity
                </span>
              </h1>
              
              <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-light">
                Create your sovereign Nostr identity in minutes. No email required, 
                no corporate control - just pure digital freedom.
              </p>
            </div>

            {/* Enhanced CTA */}
            <div className="space-y-4">
              <button
                onClick={handleGetStarted}
                className="group relative bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-800 text-white px-12 py-5 rounded-2xl font-semibold text-xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 flex items-center mx-auto overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="relative">Create Nostr Identity</span>
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300 relative" />
              </button>

              <div className="flex items-center justify-center space-x-6 text-sm text-slate-500">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-1 text-slate-700" />
                  100% Secure
                </div>
                <div className="flex items-center">
                  <Zap className="w-4 h-4 mr-1 text-slate-700" />
                  5 Minutes Setup
                </div>
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-1 text-slate-700" />
                  Globally Accessible
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced What is Nostr Section */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/50 max-w-4xl mx-auto relative">
            <div className="absolute top-6 right-6">
              <button
                onMouseEnter={() => setShowTooltip('nostr-info')}
                onMouseLeave={() => setShowTooltip(null)}
                className="relative p-2 text-slate-400 hover:text-green-600 transition-colors"
              >
                <HelpCircle className="w-5 h-5" />
                {showTooltip === 'nostr-info' && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-slate-900 text-white text-xs rounded-xl p-3 shadow-xl z-20">
                    <div className="absolute -top-1 right-4 w-2 h-2 bg-slate-900 rotate-45"></div>
                    Nostr stands for "Notes and Other Stuff Transmitted by Relays" - it's a simple, open protocol for decentralized social networking.
                  </div>
                )}
              </button>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                What Makes Nostr Special?
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed max-w-2xl mx-auto">
                Unlike traditional social platforms, Nostr gives you complete ownership of your identity and data through cryptographic keys.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="group text-center p-6 rounded-2xl hover:bg-green-50/50 transition-all duration-300">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-800 to-black rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-2xl border border-slate-300/30 group-hover:shadow-3xl group-hover:scale-105 group-hover:border-slate-400/50 transition-all duration-300 backdrop-blur-sm">
                    <Key className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                  <button
                    onMouseEnter={() => setShowTooltip('keys')}
                    onMouseLeave={() => setShowTooltip(null)}
                    className="absolute -top-1 -right-1 p-1 text-slate-400 hover:text-green-600 transition-colors"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                  {showTooltip === 'keys' && (
                    <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 w-56 bg-slate-900 text-white text-xs rounded-xl p-3 shadow-xl z-20">
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                      Your private key is like a master password that proves your identity. Only you control it - no company can lock you out.
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-slate-800 mb-3 text-lg">Your Keys, Your Identity</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Control your digital identity that no corporation can revoke or control.
                </p>
              </div>

              <div className="group text-center p-6 rounded-2xl hover:bg-green-50/50 transition-all duration-300">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-800 to-black rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-2xl border border-slate-300/30 group-hover:shadow-3xl group-hover:scale-105 group-hover:border-slate-400/50 transition-all duration-300 backdrop-blur-sm">
                    <Radio className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                  <button
                    onMouseEnter={() => setShowTooltip('decentralized')}
                    onMouseLeave={() => setShowTooltip(null)}
                    className="absolute -top-1 -right-1 p-1 text-slate-400 hover:text-green-600 transition-colors"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                  {showTooltip === 'decentralized' && (
                    <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 w-56 bg-slate-900 text-white text-xs rounded-xl p-3 shadow-xl z-20">
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                      No single server or company controls Nostr. It runs on a network of independent relays worldwide.
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-slate-800 mb-3 text-lg">Truly Decentralized. Truly Yours.</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  No single point of failure or control. The network belongs to everyone and no one.
                </p>
              </div>

              <div className="group text-center p-6 rounded-2xl hover:bg-green-50/50 transition-all duration-300">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-800 to-black rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-2xl border border-slate-300/30 group-hover:shadow-3xl group-hover:scale-105 group-hover:border-slate-400/50 transition-all duration-300 backdrop-blur-sm">
                    <Users className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                  <button
                    onMouseEnter={() => setShowTooltip('interoperable')}
                    onMouseLeave={() => setShowTooltip(null)}
                    className="absolute -top-1 -right-1 p-1 text-slate-400 hover:text-green-600 transition-colors"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                  {showTooltip === 'interoperable' && (
                    <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 w-56 bg-slate-900 text-white text-xs rounded-xl p-3 shadow-xl z-20">
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                      Switch between different Nostr apps seamlessly. Your followers and content move with you.
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-slate-800 mb-3 text-lg">Universal Compatibility</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Use any Nostr client while keeping your identity, followers, and content intact.
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <div className="flex justify-center space-x-8 text-sm">
                <a 
                  href="https://nostr.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group text-slate-600 hover:text-green-600 font-medium flex items-center transition-colors"
                >
                  Learn more about Nostr
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </a>
                <a 
                  href="https://nostrapps.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group text-slate-600 hover:text-green-600 font-medium flex items-center transition-colors"
                >
                  Browse Nostr apps
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 mb-16 max-w-2xl mx-auto">
            <div className="space-y-6">
              {/* Python Script Option */}
              <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 border border-gray-700 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                {/* Subtle code pattern overlay */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)`,
                  }}></div>
                </div>
                <div className="flex items-start space-x-4 relative z-10">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-blue-500 rounded-xl flex items-center justify-center mt-1 flex-shrink-0 shadow-lg">
                    {/* Python Logo SVG */}
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                      <path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.26-.02.21-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25c-.2 0-.37.09-.5.27-.13.18-.2.39-.2.61 0 .22.07.43.2.61.13.18.3.27.5.27.2 0 .37-.09.5-.27.13-.18.2-.39.2-.61 0-.22-.07-.43-.2-.61-.13-.18-.3-.27-.5-.27z" fill="#FFD43B"/>
                      <path d="M9.75 23.82l-.9-.2-.73-.26-.59-.3-.45-.32-.34-.34-.25-.34-.16-.33-.1-.3-.04-.26-.02-.2.01-.13V15.5l.05-.63.13-.55.21-.46.26-.38.3-.31.33-.25.35-.19.35-.14.33-.1.3-.07.26-.04.21-.02h5.84l.69-.05.59-.14.5-.22.41-.27.33-.32.27-.35.2-.36.15-.37.1-.35.07-.32.04-.27.02-.21v-3.06h2.09l.21.03.28.07.32.12.35.18.36.26.36.36.35.46.32.59.28.73.21.88.14 1.05.05 1.23-.06 1.22-.16 1.04-.24.87-.32.71-.36.57-.4.44-.42.33-.42.24-.4.16-.36.1-.32.05-.26.02-.21.01h-5.84l-.69.05-.59.14-.5.21-.41.28-.33.32-.27.35-.2.36-.15.36-.1.35-.07.32-.04.28-.02.21v3.06h-2.09l-.14-.01zm6.47-14.25c.2 0 .37-.09.5-.27.13-.18.2-.39.2-.61 0-.22-.07-.43-.2-.61-.13-.18-.3-.27-.5-.27-.2 0-.37.09-.5.27-.13.18-.2.39-.2.61 0 .22.07.43.2.61.13.18.3.27.5.27z" fill="#306998"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white mb-2 text-lg">Don't Trust Us? Good!</h4>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      We don't store your keys, but if you want maximum security, download our Python script 
                      and generate your Nostr identity completely offline on your local machine.
                    </p>
                    <a
                      href="https://github.com/Buho-Ecosystem/Nostr_Key_Generator"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      Download Python Script
                    </a>
                    <div className="mt-3 flex items-center text-sm text-gray-400">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                      100% offline • Open source • Maximum privacy
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Original Trust Section (now moved above) */}
          <div className="hidden">
            <div className="bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 border border-slate-300/30 rounded-2xl p-6 shadow-lg relative overflow-hidden">
              {/* Subtle shine overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-br from-slate-800 to-black rounded-full flex items-center justify-center mt-1 flex-shrink-0 shadow-lg border border-slate-300/30 relative z-10">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 relative z-10">
                  <h4 className="font-bold text-black mb-2 text-lg">Bank-Grade Security</h4>
                  <p className="text-slate-700 leading-relaxed">
                    Your private keys are generated locally in your browser using industry-standard cryptography. 
                    We never see or store your keys—they belong to you alone.
                  </p>
                  <div className="mt-3 flex items-center text-sm text-slate-600">
                    <div className="w-2 h-2 bg-black rounded-full mr-2"></div>
                    Keys generated offline • Zero server storage • Open source
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Modal */}
      {showWelcomeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-200/50 transform animate-in fade-in duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Key className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-3">Ready to Get Started?</h3>
              <p className="text-slate-700 mb-6 leading-relaxed">
                We'll guide you through creating your Nostr identity step by step. 
                The entire process takes about 5 minutes and is completely secure.
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
                  Securely backup your identity
                </div>
                <div className="flex items-center text-sm text-slate-700">
                  <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-black font-bold text-xs">3</span>
                  </div>
                  Create your profile and go live
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
                  className="flex-1 bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-800 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center"
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
