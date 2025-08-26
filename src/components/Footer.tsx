"use client"

import { Github, Twitter, FileText, Map, Check, Zap, Copy, MessageSquare, Smartphone, Key } from "lucide-react"
import { useState } from "react"

const BuhoLogo = ({ width = 32, height = 32, className = "" }) => (
  <img 
    src="https://github.com/DoktorShift/images/blob/main/buho_logo.png?raw=true"
    alt="Buho Logo"
    width={width}
    height={height}
    className={`${className}`}
  />
)

export default function Footer() {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const npubAddress = "npub17c2szua46mc8ndp4grvy4z5465x0qxjge8tqx7vyu0vkqr24y2hssuuy6f"
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-green-50/80 border-t border-gray-300/20">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <BuhoLogo width={32} height={32} className="h-8 w-auto" />
              <span className="text-2xl font-bold text-gray-800">Buho</span>
            </div>
            <p className="text-gray-600 text-sm mb-4 max-w-xs">
              A community-driven Bitcoin Lightning web app built with NWC and open technologies.
            </p>
            <div className="flex items-center gap-2 bg-green-600/10 px-3 py-2 rounded-lg">
              <Zap className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-600">Lightning Powered</span>
            </div>
          </div>

         {/* Resources */}
<div>
  <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider mb-4">Resources</h3>
  <div className="space-y-3">
    <a
      href="https://roadmap.mybuho.de"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors text-sm"
    >
      <Map className="h-4 w-4" />
      Roadmap
    </a>
    <a
      href="https://docs.mybuho.de"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors text-sm"
    >
      <FileText className="h-4 w-4" />
      Documentation
    </a>
    <a
      href="#"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors text-sm"
    >
      <Key className="h-4 w-4" />
      Nostr KeyGenerator
    </a>
  </div>
</div>

          {/* Apps */}
          <div>
            <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider mb-4">Apps</h3>
            <div className="space-y-3">
              <a
                href="https://go.mybuho.de"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors text-sm"
              >
                <Smartphone className="h-4 w-4" />
                BuhoGO
              </a>
              <a
                href="https://aurora-pay.mybuho.de"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors text-sm"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
                </svg>
                Payment API
              </a>
            </div>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider mb-4">Connect</h3>
            <div className="space-y-3">
              <a
                href="/contact"
                className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors text-sm"
              >
                <MessageSquare className="h-4 w-4" />
                Contact Us
              </a>
              <a
                href="https://twitter.com/drshift3"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors text-sm"
              >
                <Twitter className="h-4 w-4" />
                @drshift3
              </a>
              <a
                href="https://github.com/DoktorShift"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors text-sm"
              >
                <Github className="h-4 w-4" />
                DoktorShift
              </a>
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <div className="w-4 h-4 flex items-center justify-center">
                  <span className="text-xs">⚡</span>
                </div>
                <span
                  className="font-mono text-xs cursor-pointer hover:text-green-600 transition-colors flex items-center"
                  onClick={() => copyToClipboard(npubAddress)}
                  title="Click to copy Nostr address"
                >
                  npub17c2...y2hssuuy6f
                  {copied ? (
                    <Check className="h-3 w-3 ml-1 text-green-600" />
                  ) : (
                    <Copy className="h-3 w-3 ml-1 opacity-50" />
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Get Started */}
          <div>
            <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider mb-4">Get Started</h3>
            <div className="space-y-3">
              <a
                href="https://buho.kaffeesats.net"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                <Zap className="h-4 w-4" />
                Your Wallet
              </a>
              <p className="text-gray-600 text-xs">
                Create your Bitcoin Lightning wallet today
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300/30 mb-6"></div>

        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          {/* Copyright and Credits */}
          <div className="flex flex-col lg:flex-row items-center gap-4 text-center lg:text-left">
            <p className="text-sm text-gray-600">
              © {currentYear} Buho. Built on open technologies.
            </p>
            <div className="hidden lg:block w-px h-4 bg-gray-300"></div>
            <p className="text-sm text-gray-600">
              Created by{" "}
              <a
                href="https://github.com/DoktorShift"
                className="text-green-600 hover:text-green-700 transition-colors font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Dr.Shift
              </a>{" "}
              and{" "}
              <a 
                href="https://github.com/pratik227" 
                className="text-green-600 hover:text-green-700 transition-colors font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Pratik227
              </a>
            </p>
          </div>

          {/* Legal Links */}
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-gray-400 hover:text-gray-500 transition-colors text-sm"
            >
              Impressum
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-gray-500 transition-colors text-sm"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}