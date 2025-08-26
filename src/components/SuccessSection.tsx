import React from 'react';
import { CheckCircle, ExternalLink, Copy, ArrowRight, Shield, Zap, Star, Users, Globe, Download, Sparkles, Rocket } from 'lucide-react';
import { nip19 } from 'nostr-tools';
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
    { 
      name: 'Damus', 
      url: 'https://damus.io', 
      description: 'Beautiful iOS/Mac client',
      category: 'Mobile',
      featured: true
    },
    { 
      name: 'Amethyst', 
      url: 'https://amethyst.social', 
      description: 'Feature-rich Android client',
      category: 'Mobile',
      featured: true
    },
    { 
      name: 'Primal', 
      url: 'https://primal.net', 
      description: 'Modern web and mobile client',
      category: 'Web',
      featured: true
    },
    { 
      name: 'ZapTracker', 
      url: 'https://zap-tracker.netlify.app', 
      description: 'Lightning-focused tracking',
      category: 'Web',
      featured: false
    },
    { 
      name: 'Yakihonne', 
      url: 'https://yakihonne.com', 
      description: 'Content creator platform',
      category: 'Web',
      featured: false
    },
    { 
      name: 'Snort', 
      url: 'https://snort.social', 
      description: 'Modern web client',
      category: 'Web',
      featured: false
    }
  ];

  const featuredClients = nostrClients.filter(client => client.featured);
  const otherClients = nostrClients.filter(client => !client.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <Header />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Success Header */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            🎉 You're on Nostr!
          </h1>
          
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Your decentralized identity is live. Welcome to the future of social media.
          </p>
          
          {/* Identity Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 inline-block">
            <p className="text-sm text-slate-500 mb-2">Your Identity</p>
            <div className="flex items-center space-x-3">
              <code className="text-green-600 font-mono text-sm bg-green-50 px-4 py-2 rounded-lg">
                {keys.npub.slice(0, 16)}...{keys.npub.slice(-8)}
              </code>
              <button
                onClick={() => handleCopy(keys.npub, 'npub')}
                className="p-2 text-green-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              >
                {copied === 'npub' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 mb-12">
          <div className="flex items-center mb-6">
            <Rocket className="w-6 h-6 text-green-600 mr-3" />
            <h2 className="text-2xl font-bold text-slate-900">What's Next?</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold text-lg">1</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Choose an App</h3>
              <p className="text-slate-600 text-sm">Pick a Nostr client from the options below</p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold text-lg">2</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Import Your Key</h3>
              <p className="text-slate-600 text-sm">Use your private key to sign in</p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold text-lg">3</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Start Connecting</h3>
              <p className="text-slate-600 text-sm">Follow people and join conversations</p>
            </div>
          </div>
        </div>

        {/* Recommended Apps */}
        <div className="mb-12">
          <div className="flex items-center mb-8">
            <Star className="w-6 h-6 text-green-600 mr-3" />
            <h2 className="text-2xl font-bold text-slate-900">Recommended Apps</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {featuredClients.map((client) => (
              <a
                key={client.name}
                href={client.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-green-300 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-slate-900 group-hover:text-green-600 transition-colors">
                    {client.name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                      {client.category}
                    </span>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-green-500 transition-colors" />
                  </div>
                </div>
                <p className="text-slate-600 text-sm">
                  {client.description}
                </p>
              </a>
            ))}
          </div>
          
          {/* More Options */}
          <div className="bg-slate-50 rounded-2xl p-6">
            <h3 className="font-semibold text-slate-900 mb-4">More Options</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {otherClients.map((client) => (
                <a
                  key={client.name}
                  href={client.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white p-4 rounded-xl border border-slate-200 hover:border-green-300 transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-slate-900 group-hover:text-green-600 transition-colors">
                      {client.name}
                    </h4>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-green-500 transition-colors" />
                  </div>
                  <p className="text-sm text-slate-600">
                    {client.description}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Key Security Reminder */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
          <div className="flex items-start space-x-4">
            <Shield className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-slate-900 mb-2">Keep Your Keys Safe</h3>
              <div className="grid md:grid-cols-2 gap-4 text-slate-700 text-sm">
                <div className="space-y-1">
                  <p>• Your private key is your digital identity</p>
                  <p>• Never share it with anyone</p>
                </div>
                <div className="space-y-1">
                  <p>• Keep secure backups in multiple places</p>
                  <p>• Consider using a password manager</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="text-center mt-12">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center"
            >
              <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
              Create Another Account
            </button>
            
            <a
              href="https://nostrapps.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center"
            >
              <Globe className="w-4 h-4 mr-2" />
              Explore More Apps
            </a>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}