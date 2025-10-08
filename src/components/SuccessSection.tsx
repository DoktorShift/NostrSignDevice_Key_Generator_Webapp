import React from 'react';
import {
  CheckCircle, ExternalLink, Copy, ArrowRight, Shield, Zap, Star, Users, Globe, Download, Sparkles, Rocket
} from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import type { KeyPair, NostrProfile } from '../types/nostr';

interface SuccessSectionProps {
  keys: KeyPair;
  profile: NostrProfile;
}

export default function SuccessSection({ keys, profile }: SuccessSectionProps) {
  const [copied, setCopied] = React.useState<string | null>(null);

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const nostrClients = [
    { name: 'Damus', url: 'https://damus.io', description: 'Beautiful iOS/Mac client', category: 'Mobile', featured: true },
    { name: 'Amethyst', url: 'https://amethyst.social', description: 'Feature-rich Android client', category: 'Mobile', featured: true },
    { name: 'Primal', url: 'https://primal.net', description: 'Modern web and mobile client', category: 'Web', featured: true },
    { name: 'ZapTracker', url: 'https://zap-tracker.netlify.app', description: 'Lightning-focused tracking', category: 'Web', featured: false },
    { name: 'Yakihonne', url: 'https://yakihonne.com', description: 'Content creator platform', category: 'Web', featured: false },
    { name: 'Snort', url: 'https://snort.social', description: 'Modern web client', category: 'Web', featured: false },
  ];

  const featuredClients = nostrClients.filter(c => c.featured);
  const otherClients = nostrClients.filter(c => !c.featured);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-14">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-gray-200 bg-gray-50">
            <CheckCircle className="w-8 h-8 text-black" />
          </div>

          <h1 className="text-4xl font-bold text-gray-900">Identity Created!</h1>
          <p className="text-gray-600 text-base mt-2 max-w-2xl mx-auto">
            Your Nostr identity is ready. Now transfer your keys to your hardware device for maximum security.
          </p>

          {/* Identity card */}
          <div className="mt-6 inline-flex items-center gap-3 bg-white rounded-2xl p-4 shadow-lg border border-gray-200">
            <div className="text-sm text-gray-500">Your Identity</div>
            <code className="text-gray-900 font-mono text-sm bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
              {keys.npub.slice(0, 16)}...{keys.npub.slice(-8)}
            </code>
            <button
              onClick={() => handleCopy(keys.npub, 'npub')}
              className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 hover:border-green-500 hover:text-green-700 transition-colors"
              title="Copy your npub"
            >
              {copied === 'npub' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 mb-12">
          <div className="flex items-center mb-6">
            <Rocket className="w-6 h-6 text-purple-700 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">What's next</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 bg-gray-100 border border-gray-200">
                <span className="text-black font-bold text-lg">1</span>
              </div>
              <p className="font-medium text-gray-900">Transfer your keys</p>
              <p className="text-gray-600 text-sm">Import to your signing device</p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 bg-gray-100 border border-gray-200">
                <span className="text-black font-bold text-lg">2</span>
              </div>
              <p className="font-medium text-gray-900">Configure device</p>
              <p className="text-gray-600 text-sm">Set up WiFi and relay connections</p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 bg-gray-100 border border-gray-200">
                <span className="text-black font-bold text-lg">3</span>
              </div>
              <p className="font-medium text-gray-900">Connect apps</p>
              <p className="text-gray-600 text-sm">Use NIP-46 to connect clients</p>
            </div>
          </div>
        </div>

        {/* Recommended Apps */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <Star className="w-6 h-6 text-purple-700 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Compatible Nostr clients</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {featuredClients.map((client) => (
              <a
                key={client.name}
                href={client.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white p-6 rounded-2xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                    {client.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full border border-gray-200">
                      {client.category}
                    </span>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{client.description}</p>
              </a>
            ))}
          </div>

          {/* More Options */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <p className="font-medium text-gray-900 mb-4">More options</p>
            <div className="grid md:grid-cols-3 gap-4">
              {otherClients.map((client) => (
                <a
                  key={client.name}
                  href={client.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white p-4 rounded-xl border border-gray-200 hover:border-purple-300 transition-all"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="font-medium text-gray-900 group-hover:text-purple-700 transition-colors">
                      {client.name}
                    </p>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
                  </div>
                  <p className="text-sm text-gray-600">{client.description}</p>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Key Security Reminder */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-purple-700 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900 mb-1">Hardware device security</p>
              <div className="grid md:grid-cols-2 gap-2 text-gray-700 text-sm">
                <p>• Transfer keys to your signing device securely</p>
                <p>• Device requires manual approval for all requests</p>
                <p>• Keys never leave the hardware</p>
                <p>• Use touchscreen to authorize connections</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="text-center mt-12">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-white text-gray-800 border border-gray-300 px-6 py-3 rounded-xl font-medium
                         transition-colors hover:bg-gray-50 hover:border-purple-500 hover:text-purple-700 inline-flex items-center"
            >
              <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
              Create Another Identity
            </button>

            <a
              href="https://github.com/lnbits/nsec-remote-signer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white px-6 py-3 rounded-xl font-medium transition-colors bg-gradient-to-r from-purple-600 to-purple-800
                         hover:from-purple-700 hover:to-purple-900 inline-flex items-center"
            >
              <Globe className="w-4 h-4 mr-2" />
              View Device Docs
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
