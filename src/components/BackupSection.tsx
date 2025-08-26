import React, { useState } from 'react';
import { Shield, Download, QrCode, AlertTriangle, Check, Copy, Eye, EyeOff, CheckCircle, XCircle, Key, Lock, FileText, HelpCircle } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-6xl mx-auto w-full">
        {currentStep === 'backup' && (
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-800 to-black rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-slate-900 mb-4">
                Secure Your Identity
              </h1>
              <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-2xl mx-auto">
                <div className="flex items-start space-x-4">
                  <AlertTriangle className="w-6 h-6 text-white mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-white text-lg mb-2">Critical: Backup Required</h3>
                    <p className="text-slate-300 leading-relaxed">
                      Your keys are your only way to access this account. We cannot recover them if lost.
                      Choose at least one backup method below.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Keys Display */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-slate-800 to-black p-6">
                    <div className="flex items-center text-white">
                      <Key className="w-6 h-6 mr-3" />
                      <h2 className="text-xl font-bold">Your Nostr Keys</h2>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    {/* Public Key */}
                    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-slate-600 rounded-xl flex items-center justify-center mr-4">
                            <Eye className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 text-lg">Public Key</h3>
                            <p className="text-slate-600 text-sm">Safe to share with anyone</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            handleCopy(keys.npub, 'npub');
                            markBackupMethod('copy-public');
                          }}
                          className="p-3 bg-slate-600 hover:bg-slate-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                          {copied === 'npub' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                        </button>
                      </div>
                      <input
                        type="text"
                        value={keys.npub}
                        readOnly
                        className="w-full p-4 border border-slate-300 rounded-xl bg-white font-mono text-sm text-slate-800 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      />
                    </div>

                    {/* Private Key */}
                    <div className="border border-slate-300 rounded-xl p-4 bg-slate-100">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center mr-4">
                            <Lock className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 text-lg">Private Key</h3>
                            <p className="text-slate-700 text-sm">Keep absolutely secret</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setShowPrivateKey(!showPrivateKey)}
                            className="p-3 bg-slate-500 hover:bg-slate-600 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                          >
                            {showPrivateKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                          <button
                            onClick={() => {
                              handleCopy(keys.nsec, 'nsec');
                              markBackupMethod('copy-private');
                            }}
                            className="p-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                          >
                            {copied === 'nsec' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                      <input
                        type={showPrivateKey ? 'text' : 'password'}
                        value={keys.nsec}
                        readOnly
                        className="w-full p-4 border border-slate-400 rounded-xl bg-white font-mono text-sm text-slate-800 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      />
                    </div>

                    {/* Mnemonic if available */}
                    {keys.mnemonic && (
                      <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center mr-4">
                              <FileText className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-slate-900 text-lg">Recovery Phrase</h3>
                              <p className="text-slate-600 text-sm">Alternative backup method</p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              handleCopy(keys.mnemonic!, 'mnemonic');
                              markBackupMethod('copy-mnemonic');
                            }}
                            className="p-3 bg-slate-700 hover:bg-slate-800 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                          >
                            {copied === 'mnemonic' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                          </button>
                        </div>
                        <input
                          type={showPrivateKey ? 'text' : 'password'}
                          value={keys.mnemonic}
                          readOnly
                          className="w-full p-4 border border-slate-300 rounded-xl bg-white font-mono text-sm text-slate-800 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Backup Methods */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-6 text-white">
                    <h2 className="font-bold text-xl mb-2">Backup Methods</h2>
                    <p className="text-slate-300">Choose at least one method</p>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    {/* Download Method */}
                    <div className="border border-slate-200 rounded-xl p-4 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mr-3">
                            <Download className="w-6 h-6 text-slate-700" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900">Download File</h3>
                            <p className="text-slate-600 text-sm">Secure JSON file</p>
                          </div>
                        </div>
                        {backupMethods.download && (
                          <CheckCircle className="w-6 h-6 text-slate-600" />
                        )}
                      </div>
                      <button
                        onClick={downloadKeyFile}
                        className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        Download Keys
                      </button>
                    </div>

                    {/* QR Code Method */}
                    <div className="border border-slate-200 rounded-xl p-4 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mr-3">
                            <QrCode className="w-6 h-6 text-slate-700" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900">QR Code</h3>
                            <p className="text-slate-600 text-sm">Scan with device</p>
                          </div>
                        </div>
                        {backupMethods.qr && (
                          <CheckCircle className="w-6 h-6 text-slate-600" />
                        )}
                      </div>
                      <div className="text-center">
                        <img
                          src={generateQRCode(keys.nsec)}
                          alt="Private key QR"
                          className="w-32 h-32 mx-auto border border-slate-200 rounded-xl"
                          onLoad={() => markBackupMethod('qr')}
                        />
                        <button
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = generateQRCode(keys.nsec);
                            link.download = `buho-private-key-qr-${keys.npub.slice(4, 12)}.png`;
                            link.click();
                          }}
                          className="mt-3 text-slate-600 hover:text-slate-800 text-sm font-medium transition-colors"
                        >
                          Download QR
                        </button>
                      </div>
                    </div>

                    {/* Manual Copy Method */}
                    <div className="border border-slate-200 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mr-3">
                            <Copy className="w-6 h-6 text-slate-700" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900">Manual Copy</h3>
                            <p className="text-slate-600 text-sm">Copy to secure location</p>
                          </div>
                        </div>
                        {(backupMethods['copy-private'] || backupMethods['copy-mnemonic']) && (
                          <CheckCircle className="w-6 h-6 text-slate-600" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Why This Matters */}
                <div className="bg-slate-100 border border-slate-300 rounded-xl p-6">
                  <div className="flex items-start">
                    <HelpCircle className="w-6 h-6 text-slate-600 mt-1 mr-4 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-slate-900 mb-3">Why This Matters</h3>
                      <ul className="text-slate-700 space-y-2">
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-slate-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span>No company can recover your keys</span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-slate-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span>Lost keys mean lost account forever</span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-slate-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span>Your backup is your only safety net</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <div className="text-center mt-8">
              <button
                onClick={() => setCurrentStep('verify')}
                disabled={!hasAnyBackup}
                className="bg-gradient-to-r from-slate-800 to-black hover:from-black hover:to-slate-900 disabled:from-slate-400 disabled:to-slate-500 text-white py-4 px-8 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-200 disabled:cursor-not-allowed"
              >
                {hasAnyBackup ? 'Continue to Security Check' : 'Create a backup first'}
              </button>
            </div>
          </>
        )}

        {currentStep === 'verify' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-800 to-black rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-slate-900 mb-4">Security Check</h1>
              <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                Quick verification to ensure you understand key security
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
              <div className="space-y-8">
                {quizQuestions.map((question, index) => (
                  <div key={question.id} className="border border-slate-200 rounded-xl p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-black rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 text-lg mb-4">
                          {question.question}
                        </h3>
                        <div className="space-y-3">
                          {question.options.map((option) => {
                            const isSelected = quizAnswers[question.id] === option;
                            const isCorrect = option === question.correct;
                            const showResult = quizAnswers[question.id] && quizAnswers[question.id] !== '';
                            
                            return (
                              <label 
                                key={option} 
                                className={`flex items-center space-x-3 cursor-pointer p-4 rounded-xl border transition-all duration-200 ${
                                  showResult
                                    ? isCorrect
                                      ? 'border-slate-400 bg-slate-100'
                                      : isSelected
                                      ? 'border-slate-300 bg-slate-50'
                                      : 'border-slate-200 bg-white'
                                    : isSelected
                                    ? 'border-slate-400 bg-slate-100'
                                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={question.id}
                                  value={option}
                                  checked={isSelected}
                                  onChange={() => handleQuizAnswer(question.id, option)}
                                  className="w-5 h-5 text-slate-600 border-slate-300 focus:ring-slate-500"
                                />
                                <span className={`flex-1 ${
                                  showResult && isCorrect ? 'text-slate-900 font-medium' : 'text-slate-700'
                                }`}>
                                  {option}
                                </span>
                                {showResult && isCorrect && (
                                  <CheckCircle className="w-5 h-5 text-slate-600" />
                                )}
                                {showResult && !isCorrect && isSelected && (
                                  <XCircle className="w-5 h-5 text-slate-400" />
                                )}
                              </label>
                            );
                          })}
                        </div>
                        {quizAnswers[question.id] && (
                          <div className="mt-4 p-4 bg-slate-100 border border-slate-200 rounded-xl">
                            <p className="text-slate-700 text-sm leading-relaxed">
                              <strong>Explanation:</strong> {question.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {quizComplete && (
                <div className="mt-8 bg-slate-100 border border-slate-300 rounded-xl p-6">
                  <div className="flex items-center justify-center space-x-4 text-slate-800">
                    <CheckCircle className="w-8 h-8 text-slate-600" />
                    <div className="text-center">
                      <h3 className="font-bold text-lg">Perfect! You understand key security.</h3>
                      <p className="text-slate-600">You're ready to continue safely.</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-center mt-8">
                <button
                  onClick={onBackupComplete}
                  disabled={!quizComplete}
                  className="bg-gradient-to-r from-slate-800 to-black hover:from-black hover:to-slate-900 disabled:from-slate-400 disabled:to-slate-500 text-white py-4 px-8 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-200 disabled:cursor-not-allowed"
                >
                  {quizComplete ? 'Continue to Profile Setup' : 'Answer all questions to continue'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}