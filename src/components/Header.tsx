import React from 'react';
import { Menu, X, ChevronDown, ExternalLink } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isSigningAppsOpen, setIsSigningAppsOpen] = React.useState(false);

  const signingApps = [
    { name: 'Amber', url: 'https://github.com/greenart7c3/Amber', description: 'Android signing app', category: 'Mobile' },
    { name: 'nos2x', url: 'https://github.com/fiatjaf/nos2x', description: 'Browser extension', category: 'Browser' },
    { name: 'nsec.app', url: 'https://nsec.app', description: 'Web-based signer', category: 'Web' },
    { name: 'Alby', url: 'https://getalby.com', description: 'Browser extension with Lightning', category: 'Browser' }
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <a
            href="https://github.com/lnbits/nsec-remote-signer"
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity group"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg className="w-8 h-8 text-purple-600 group-hover:scale-105 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-700 via-purple-600 to-purple-700 bg-clip-text text-transparent">
              Nostr Device Setup
            </span>
          </a>

          <nav className="hidden md:flex items-center space-x-6">
            <div className="relative">
              <button
                onClick={() => setIsSigningAppsOpen(!isSigningAppsOpen)}
                className="flex items-center text-slate-700 hover:text-purple-700 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-purple-50"
              >
                Signing Apps
                <ChevronDown className={`w-4 h-4 ml-1 transition-transform duration-200 ${isSigningAppsOpen ? 'rotate-180' : ''}`} />
              </button>

              {isSigningAppsOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsSigningAppsOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-200/50 py-2 z-20 backdrop-blur-xl">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <h3 className="font-semibold text-black text-sm">Secure Key Management</h3>
                      <p className="text-xs text-slate-700 mt-1">Use these apps to safely manage your Nostr keys</p>
                    </div>
                    {signingApps.map((app) => (
                      <a
                        key={app.name}
                        href={app.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-4 py-3 hover:bg-purple-50 transition-colors group"
                        onClick={() => setIsSigningAppsOpen(false)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-black group-hover:text-purple-700 transition-colors">
                              {app.name}
                            </div>
                            <div className="text-sm text-slate-700">{app.description}</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs bg-slate-100 text-black px-2 py-1 rounded-full">
                              {app.category}
                            </span>
                            <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-purple-500 transition-colors" />
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </>
              )}
            </div>

            <a
              href="https://nostrapps.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-700 hover:text-purple-700 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-purple-50 flex items-center"
            >
              Apps
              <ExternalLink className="w-3 h-3 ml-1 opacity-50" />
            </a>

            <a
              href="https://github.com/lnbits/nsec-remote-signer"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white px-6 py-2 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Device Docs
            </a>
          </nav>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-700 hover:text-black hover:bg-slate-100 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200/50">
            <div className="flex flex-col space-y-4">
              <div>
                <button
                  onClick={() => setIsSigningAppsOpen(!isSigningAppsOpen)}
                  className="flex items-center justify-between w-full text-slate-700 hover:text-purple-700 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-purple-50"
                >
                  Signing Apps
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isSigningAppsOpen ? 'rotate-180' : ''}`} />
                </button>
                {isSigningAppsOpen && (
                  <div className="mt-2 ml-4 space-y-2">
                    {signingApps.map((app) => (
                      <a
                        key={app.name}
                        href={app.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block py-2 text-sm text-slate-700 hover:text-purple-700 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{app.name}</div>
                            <div className="text-xs text-slate-600">{app.description}</div>
                          </div>
                          <span className="text-xs bg-slate-100 text-black px-2 py-1 rounded-full">
                            {app.category}
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <a
                href="https://nostrapps.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-700 hover:text-purple-700 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-purple-50 flex items-center"
              >
                Apps
                <ExternalLink className="w-3 h-3 ml-1 opacity-50" />
              </a>

              <a
                href="https://github.com/lnbits/nsec-remote-signer"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white px-6 py-2 rounded-xl font-medium transition-all duration-200 w-full shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Device Docs
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
