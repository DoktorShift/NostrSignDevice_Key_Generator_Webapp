import React, { useState } from 'react';
import { Shield, Download, QrCode, AlertTriangle, Check, Copy, Eye, EyeOff, Info, CheckCircle, XCircle, HelpCircle, Key, Lock, FileText } from 'lucide-react';
import type { KeyPair } from '../types/nostr';

interface BackupSectionProps {
  keys: KeyPair;
  onBackupComplete: () => void;
}

export default function BackupSection({ keys, onBackupComplete }: BackupSectionProps) {
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState<'backup' | 'verify'>('backup');
  const [quizComplete, setQuizComplete] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [backupMethods, setBackupMethods] = useState<Record<string, boolean>>({});
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const quizQuestions = [
    {
      id: 'lose-key',
      question: 'What happens if I lose my private key?',
      options: [
        'I lose access to my account forever',
        'I can reset it with my email',
        'Buho can recover it for me'
      ],
      correct: 'I lose access to my account forever',
      explanation: 'Private keys cannot be recovered. This is what makes Nostr truly decentralized—no company can control your account.'
    },
    {
      id: 'share-key',
      question: 'Who should I share my private key with?',
      options: [
        'Nobody, ever',
        'Close friends only',
        'Customer support if needed'
      ],
      correct: 'Nobody, ever',
      explanation: 'Your private key is like your digital DNA. Anyone with access can impersonate you completely.'
    },
    {
      id: 'backup-importance',
      question: 'Why is backing up my key important?',
      options: [
        'To recover access if I lose my device',
        'For faster login',
        'To get priority features'
      ],
      correct: 'To recover access if I lose my device',
      explanation: 'Your private key is the only way to prove your identity. Without a backup, losing your device means losing your account.'
    }
  ];

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const downloadKeyFile = () => {
    const keyData = {
      version: '1.0',
      type: 'nostr-keys',
      npub: keys.npub,
      nsec: keys.nsec,
      publicKey: keys.publicKey,
      ...(keys.mnemonic && { mnemonic: keys.mnemonic }),
      createdAt: new Date().toISOString(),
      warning: 'KEEP THIS FILE SECURE! Anyone with access to this file can control your Nostr identity.',
      instructions: 'Import this file into a Nostr client or use the nsec key directly.'
    };

    const blob = new Blob([JSON.stringify(keyData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `buho-nostr-keys-${keys.npub.slice(4, 12)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setBackupMethods(prev => ({ ...prev, download: true }));
  };

  const generateQRCode = (text: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
  };

  const checkQuizAnswers = () => {
    const allCorrect = quizQuestions.every(q => quizAnswers[q.id] === q.correct);
    if (allCorrect) {
      setQuizComplete(true);
    }
  };

  const handleQuizAnswer = (questionId: string, answer: string) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const markBackupMethod = (method: string) => {
    setBackupMethods(prev => ({ ...prev, [method]: true }));
  };

  const hasAnyBackup = Object.values(backupMethods).some(Boolean);

  React.useEffect(() => {
    if (Object.keys(quizAnswers).length === quizQuestions.length) {
      checkQuizAnswers();
    }
  }, [quizAnswers]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50/30 flex items-center justify-center p-4">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-br from-black to-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl border border-slate-300/30">
            <Shield className="w-12 h-12 text-white drop-shadow-lg" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-black via-slate-800 to-black bg-clip-text text-transparent mb-6">
            {currentStep === 'backup' ? 'Secure Your Keys' : 'Security Knowledge Check'}
          </h1>
          <p className="text-slate-700 text-xl max-w-3xl mx-auto leading-relaxed">
            {currentStep === 'backup' 
              ? 'Your keys are your digital identity. Let\'s make sure they\'re safe and accessible only to you.' 
              : 'Quick verification to ensure you understand the importance of key security'
            }
          </p>
        </div>

        {currentStep === 'backup' && (
          <div className="space-y-12">
            {/* Critical Warning - Redesigned */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-black to-slate-800 rounded-xl flex items-center justify-center shadow-lg border border-slate-300/30 flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-black text-lg mb-2">Critical: Backup Required</h3>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    We don't store your keys on our servers and cannot recover them. 
                    You must create a backup to ensure you never lose access to your account.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-6">
              {/* Keys Display - Redesigned */}
              <div className="lg:col-span-3">
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-slate-200/50">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-bold text-black flex items-center">
                      <Key className="w-6 h-6 mr-3" />
                      Your Nostr Keys
                    </h3>
                    <button
                      onMouseEnter={() => setShowTooltip('keys-info')}
                      onMouseLeave={() => setShowTooltip(null)}
                      className="relative p-2 text-slate-400 hover:text-black transition-colors bg-slate-100 rounded-lg hover:bg-slate-200"
                    >
                      <HelpCircle className="w-5 h-5" />
                      {showTooltip === 'keys-info' && (
                        <div className="absolute right-0 top-full mt-2 w-72 bg-black text-white text-xs rounded-lg p-3 shadow-xl z-20">
                          <div className="absolute -top-1 right-4 w-2 h-2 bg-black rotate-45"></div>
                          <p className="mb-3"><strong>Public Key (npub):</strong> Safe to share. Others use this to find and verify you.</p>
                          <p><strong>Private Key (nsec):</strong> Keep secret! This proves you own your identity.</p>
                        </div>
                      )}
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Public Key */}
                    <div className="bg-green-50/50 rounded-xl p-4 border border-green-200">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3 shadow-lg">
                          <Eye className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-black">Public Key</h4>
                          <p className="text-green-700 text-sm">Safe to share with anyone</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <input
                          type="text"
                          value={keys.npub}
                          readOnly
                          className="flex-1 p-3 border border-green-300 rounded-lg bg-white text-slate-800 font-mono text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <button
                          onClick={() => {
                            handleCopy(keys.npub, 'npub');
                            markBackupMethod('copy-public');
                          }}
                          className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                          {copied === 'npub' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Private Key */}
                    <div className="bg-red-50/50 rounded-xl p-4 border border-red-200">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-black to-slate-800 rounded-lg flex items-center justify-center mr-3 shadow-lg">
                          <Lock className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-black">Private Key</h4>
                          <p className="text-red-700 text-sm">Keep this absolutely secret!</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <input
                          type={showPrivateKey ? 'text' : 'password'}
                          value={keys.nsec}
                          readOnly
                          className="flex-1 p-3 border border-red-300 rounded-lg bg-white text-slate-800 font-mono text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                        <button
                          onClick={() => setShowPrivateKey(!showPrivateKey)}
                          className="p-3 bg-slate-500 hover:bg-slate-600 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                          {showPrivateKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => {
                            handleCopy(keys.nsec, 'nsec');
                            markBackupMethod('copy-private');
                          }}
                          className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                          {copied === 'nsec' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Mnemonic */}
                    {keys.mnemonic && (
                      <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-200">
                        <div className="flex items-center mb-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3 shadow-lg">
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-black">Recovery Phrase</h4>
                            <p className="text-blue-700 text-sm">Alternative backup method</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <input
                            type={showPrivateKey ? 'text' : 'password'}
                            value={keys.mnemonic}
                            readOnly
                            className="flex-1 p-3 border border-blue-300 rounded-lg bg-white text-slate-800 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            onClick={() => {
                              handleCopy(keys.mnemonic!, 'mnemonic');
                              markBackupMethod('copy-mnemonic');
                            }}
                            className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                          >
                            {copied === 'mnemonic' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Backup Options - Redesigned */}
              <div className="space-y-4">
                {/* Download Backup */}
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-5 shadow-xl border border-slate-200/50">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-black to-slate-800 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg border border-slate-300/30">
                      <Download className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-black mb-2">Download Backup</h3>
                    <p className="text-slate-700 text-sm mb-4 leading-relaxed">
                      Save your keys as a secure file that you can import into any Nostr client
                    </p>
                    <button
                      onClick={downloadKeyFile}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Keys
                    </button>
                    {backupMethods.download && (
                    <div className="mt-3 flex items-center justify-center text-sm text-green-600">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Backup file downloaded ✅
                      </div>
                    )}
                  </div>
                </div>

                {/* QR Code Backup */}
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-5 shadow-xl border border-slate-200/50">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-black to-slate-800 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg border border-slate-300/30">
                      <QrCode className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-black mb-2">QR Code Backup</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-slate-600 mb-2">Private Key QR Code</p>
                        <div className="relative inline-block">
                          <img
                            src={generateQRCode(keys.nsec)}
                            alt="Private key QR"
                            className="w-28 h-28 mx-auto border-2 border-slate-200 rounded-lg shadow-lg"
                            onLoad={() => markBackupMethod('qr')}
                          />
                          <button
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = generateQRCode(keys.nsec);
                              link.download = `buho-private-key-qr-${keys.npub.slice(4, 12)}.png`;
                              link.click();
                            }}
                            className="absolute -bottom-2 -right-2 p-2 bg-black text-white rounded-full shadow-lg hover:bg-slate-800 transition-colors"
                            title="Download QR Code"
                          >
                            <Download className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500">
                        Scan with your phone to backup securely
                      </p>
                      {backupMethods.qr && (
                        <div className="flex items-center justify-center text-xs text-green-600">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          QR code generated ✅
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <button
                onClick={() => setCurrentStep('verify')}
                disabled={!hasAnyBackup}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-slate-400 disabled:to-slate-500 text-white py-4 px-10 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-200 disabled:cursor-not-allowed"
              >
                {hasAnyBackup ? 'Continue to Security Check ✅' : 'Create a backup first ⚠️'}
              </button>
            </div>
          </div>
        )}

        {currentStep === 'verify' && (
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200 space-y-6">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-black to-slate-800 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg border border-slate-300/30">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-black mb-2">
                Quick Security Check
              </h3>
              <p className="text-slate-600 text-sm">
                3 quick questions to ensure you understand key security
              </p>
            </div>
            
            {quizQuestions.map((question, index) => (
              <div key={question.id} className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-black to-slate-800 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg border border-slate-300/30 mt-1">
                    <span className="text-white font-bold text-xs">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-black font-semibold text-base mb-3">
                      {question.question}
                    </p>
                    <div className="space-y-2">
                      {question.options.map((option) => {
                        const isSelected = quizAnswers[question.id] === option;
                        const isCorrect = option === question.correct;
                        const showResult = quizAnswers[question.id] && quizAnswers[question.id] !== '';
                        
                        return (
                          <label 
                            key={option} 
                            className={`flex items-center space-x-2 cursor-pointer p-3 rounded-lg border transition-all duration-200 ${
                              showResult
                                ? isCorrect
                                  ? 'border-green-300 bg-green-50'
                                  : isSelected
                                  ? 'border-red-300 bg-red-50'
                                  : 'border-slate-200 bg-white'
                                : isSelected
                                ? 'border-green-300 bg-green-50'
                                : 'border-slate-200 bg-white hover:border-green-200 hover:bg-green-50/50'
                            }`}
                          >
                            <input
                              type="radio"
                              name={question.id}
                              value={option}
                              checked={isSelected}
                              onChange={() => handleQuizAnswer(question.id, option)}
                              className="w-4 h-4 text-green-600 border-slate-300 focus:ring-green-500"
                            />
                            <span className={`flex-1 text-sm ${
                              showResult && isCorrect ? 'text-green-800 font-medium' : 'text-slate-700'
                            }`}>
                              {option}
                            </span>
                            {showResult && isCorrect && (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                            {showResult && !isCorrect && isSelected && (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                          </label>
                        );
                      })}
                    </div>
                    {quizAnswers[question.id] && (
                      <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-slate-700 text-xs">
                          <strong>💡</strong> {question.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {quizComplete && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-300 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2 text-green-800">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <div className="text-center">
                    <h4 className="font-semibold text-base">Perfect! You understand key security.</h4>
                    <p className="text-green-700 text-sm">Ready to continue.</p>
                  </div>
                </div>
              </div>
            )}

            <div className="text-center">
              <button
                onClick={onBackupComplete}
                disabled={!quizComplete}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-slate-400 disabled:to-slate-500 text-white py-3 px-6 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed"
              >
                {quizComplete ? 'Continue ✅' : 'Answer all questions ⚠️'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}