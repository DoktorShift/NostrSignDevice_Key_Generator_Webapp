import React, { useState, useEffect } from 'react';
import {
  Shield, Download, QrCode, AlertTriangle, Check, Copy, Eye, EyeOff,
  CheckCircle, XCircle, Key, Lock, FileText
} from 'lucide-react';
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
      explanation:
        'Private keys cannot be recovered. This is what makes Nostr truly decentralized—no company can control your account.'
    },
    {
      id: 'share-key',
      question: 'Who should I share my private key with?',
      options: ['Nobody, ever', 'Close friends only', 'Customer support if needed'],
      correct: 'Nobody, ever',
      explanation:
        'Your private key is like your digital DNA. Anyone with access can impersonate you completely.'
    },
    {
      id: 'backup-importance',
      question: 'Why is backing up my key important?',
      options: ['To recover access if I lose my device', 'For faster login', 'To get priority features'],
      correct: 'To recover access if I lose my device',
      explanation:
        'Your private key is the only way to prove your identity. Without a backup, losing your device means losing your account.'
    }
  ];

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (e) {
      console.error('Failed to copy:', e);
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

  const generateQRCode = (text: string) =>
    `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;

  const checkQuizAnswers = () => {
    const allCorrect = quizQuestions.every(q => quizAnswers[q.id] === q.correct);
    if (allCorrect) setQuizComplete(true);
  };

  const handleQuizAnswer = (questionId: string, answer: string) =>
    setQuizAnswers(prev => ({ ...prev, [questionId]: answer }));

  const markBackupMethod = (method: string) =>
    setBackupMethods(prev => ({ ...prev, [method]: true }));

  const hasAnyBackup = Object.values(backupMethods).some(Boolean);

  useEffect(() => {
    if (Object.keys(quizAnswers).length === quizQuestions.length) checkQuizAnswers();
  }, [quizAnswers]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-6xl mx-auto w-full">
        {currentStep === 'backup' && (
          <>
            {/* Header (no alert here anymore) */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-200 bg-gray-50">
                <Shield className="w-8 h-8 text-black" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">Secure Your Identity</h1>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Keys Display */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center text-gray-900">
                      <Key className="w-6 h-6 mr-3" />
                      <h2 className="text-xl font-semibold">Your Nostr Keys</h2>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Public Key */}
                    <div className="border border-gray-200 rounded-xl p-4 bg-white">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center mr-4 bg-gray-100 border border-gray-200">
                            <Eye className="w-5 h-5 text-black" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">Public Key</h3>
                            <p className="text-gray-500 text-sm">Safe to share with anyone</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            handleCopy(keys.npub, 'npub');
                            markBackupMethod('copy-public');
                          }}
                          className="p-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
                          aria-label="Copy public key"
                        >
                          {copied === 'npub' ? <Check className="w-5 h-5 text-black" /> : <Copy className="w-5 h-5 text-black" />}
                        </button>
                      </div>
                      <input
                        type="text"
                        value={keys.npub}
                        readOnly
                        className="w-full p-4 border border-gray-300 rounded-xl bg-white font-mono text-sm text-gray-800 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                    </div>

                    {/* Private Key */}
                    <div className="border border-gray-200 rounded-xl p-4 bg-white">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center mr-4 bg-gray-100 border border-gray-200">
                            <Lock className="w-5 h-5 text-black" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">Private Key</h3>
                            <p className="text-gray-600 text-sm">Keep absolutely secret</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setShowPrivateKey(!showPrivateKey)}
                            className="p-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
                            aria-label={showPrivateKey ? 'Hide private key' : 'Show private key'}
                          >
                            {showPrivateKey ? <EyeOff className="w-5 h-5 text-black" /> : <Eye className="w-5 h-5 text-black" />}
                          </button>
                          <button
                            onClick={() => {
                              handleCopy(keys.nsec, 'nsec');
                              markBackupMethod('copy-private');
                              if (navigator.vibrate) navigator.vibrate(10);
                            }}
                            className="p-3 rounded-xl border border-gray-900 bg-black text-white hover:bg-gray-900/90 transition-colors"
                            aria-label="Copy private key"
                          >
                            {copied === 'nsec' ? <Check className="w-5 h-5 text-white" /> : <Copy className="w-5 h-5 text-white" />}
                          </button>
                        </div>
                      </div>
                      <input
                        type={showPrivateKey ? 'text' : 'password'}
                        value={keys.nsec}
                        readOnly
                        className="w-full p-4 border border-gray-300 rounded-xl bg-white font-mono text-sm text-gray-800 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                    </div>

                    {/* Mnemonic (optional) */}
                    {keys.mnemonic && (
                      <div className="border border-gray-200 rounded-xl p-4 bg-white">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center mr-4 bg-gray-100 border border-gray-200">
                              <FileText className="w-5 h-5 text-black" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 text-lg">Recovery Phrase</h3>
                              <p className="text-gray-600 text-sm">Alternative backup method</p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              handleCopy(keys.mnemonic!, 'mnemonic');
                              markBackupMethod('copy-mnemonic');
                              if (navigator.vibrate) navigator.vibrate(10);
                            }}
                            className="p-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
                            aria-label="Copy mnemonic"
                          >
                            {copied === 'mnemonic' ? <Check className="w-5 h-5 text-black" /> : <Copy className="w-5 h-5 text-black" />}
                          </button>
                        </div>
                        <input
                          type={showPrivateKey ? 'text' : 'password'}
                          value={keys.mnemonic}
                          readOnly
                          className="w-full p-4 border border-gray-300 rounded-xl bg-white font-mono text-sm text-gray-800 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        />
                      </div>
                    )}

                    {/* Critical Warning — moved here */}
                    <div className="mt-2 bg-gray-50 border border-gray-200 rounded-xl p-5">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-6 h-6 text-black mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-gray-900 text-base">Critical: Backup Required</h3>
                          <p className="text-gray-600 text-sm">
                            Your keys are your only way to access this account. We cannot recover them if lost.
                            Choose at least one backup method below.
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* End moved warning */}
                  </div>
                </div>
              </div>

              {/* Backup Methods */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="font-semibold text-xl text-gray-900">Backup Methods</h2>
                    <p className="text-gray-500">Choose at least one method</p>
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Download Method */}
                    <div className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-3 bg-gray-100 border border-gray-200">
                            <Download className="w-6 h-6 text-black" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Download File</h3>
                            <p className="text-gray-500 text-sm">Secure JSON file</p>
                          </div>
                        </div>
                        {backupMethods.download && <CheckCircle className="w-6 h-6 text-gray-600" />}
                      </div>
                      <button
                        onClick={downloadKeyFile}
                        className="w-full rounded-xl py-3 px-4 font-medium text-white bg-black border border-black hover:bg-gray-900 transition-colors"
                      >
                        Download Keys
                      </button>
                    </div>

                    {/* QR Code Method */}
                    <div className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-3 bg-gray-100 border border-gray-200">
                            <QrCode className="w-6 h-6 text-black" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">QR Code</h3>
                            <p className="text-gray-500 text-sm">Scan with device</p>
                          </div>
                        </div>
                        {backupMethods.qr && <CheckCircle className="w-6 h-6 text-gray-600" />}
                      </div>
                      <div className="text-center">
                        <img
                          src={generateQRCode(keys.nsec)}
                          alt="Private key QR"
                          className="w-32 h-32 mx-auto border border-gray-200 rounded-xl"
                          onLoad={() => markBackupMethod('qr')}
                        />
                        <button
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = generateQRCode(keys.nsec);
                            link.download = `buho-private-key-qr-${keys.npub.slice(4, 12)}.png`;
                            link.click();
                          }}
                          className="mt-3 text-gray-700 hover:text-black text-sm font-medium"
                        >
                          Download QR
                        </button>
                      </div>
                    </div>

                    {/* Manual Copy Method */}
                    <div className="border border-gray-200 rounded-xl p-4 relative">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-3 bg-gray-100 border border-gray-200">
                            <Copy className="w-6 h-6 text-black" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Manual Copy</h3>
                            <p className="text-gray-500 text-sm">Copy to secure location</p>
                          </div>
                        </div>
                        {(backupMethods['copy-private'] || backupMethods['copy-mnemonic']) && (
                          <CheckCircle className="w-6 h-6 text-gray-600" />
                        )}
                      </div>

                      <button
                        onClick={() => {
                          handleCopy(keys.nsec, 'manual-nsec');
                          markBackupMethod('copy-private');
                          if (navigator.vibrate) navigator.vibrate(10);
                        }}
                        className="w-full rounded-xl py-3 px-4 font-medium text-white bg-black border border-black hover:bg-gray-900 transition-colors active:scale-[0.99]"
                        aria-label="Copy nsec to clipboard"
                      >
                        Copy Private Key (nsec)
                      </button>

                      {/* Mobile-friendly toast */}
                      {copied === 'manual-nsec' && (
                        <div
                          role="status"
                          aria-live="polite"
                          className="pointer-events-none fixed inset-x-0 bottom-4 mx-auto w-[90%] sm:w-auto sm:min-w-[260px] bg-black text-white text-sm font-medium px-4 py-3 rounded-2xl shadow-xl border border-gray-900/70 flex items-center justify-center gap-2"
                        >
                          <Check className="w-4 h-4 text-white" />
                          Copied to clipboard
                        </div>
                      )}
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
                className="rounded-xl py-4 px-8 font-semibold text-white bg-black border border-black
                           hover:bg-gray-900 transition-colors disabled:bg-gray-300 disabled:border-gray-300
                           disabled:text-white disabled:cursor-not-allowed"
              >
                {hasAnyBackup ? 'Continue to Security Check' : 'Create a backup first'}
              </button>
            </div>
          </>
        )}

        {currentStep === 'verify' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-200 bg-gray-50">
                <Shield className="w-8 h-8 text-black" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">Security Check</h1>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Quick verification to ensure you understand key security
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              <div className="space-y-8">
                {quizQuestions.map((question, index) => {
                  const selected = quizAnswers[question.id];
                  const showResult = Boolean(selected);
                  return (
                    <div key={question.id} className="border border-gray-200 rounded-xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-gray-100 border border-gray-200">
                          <span className="text-black font-bold">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-lg mb-4">{question.question}</h3>
                          <div className="space-y-3">
                            {question.options.map(option => {
                              const isSelected = selected === option;
                              const isCorrect = option === question.correct;
                              return (
                                <label
                                  key={option}
                                  className={`flex items-center gap-3 cursor-pointer p-4 rounded-xl border transition-colors
                                    ${
                                      showResult
                                        ? isCorrect
                                          ? 'border-gray-300 bg-gray-50'
                                          : isSelected
                                          ? 'border-gray-200 bg-white'
                                          : 'border-gray-200 bg-white'
                                        : isSelected
                                        ? 'border-gray-300 bg-gray-50'
                                        : 'border-gray-200 bg-white hover:bg-gray-50'
                                    }`}
                                >
                                  <input
                                    type="radio"
                                    name={question.id}
                                    value={option}
                                    checked={isSelected}
                                    onChange={() => handleQuizAnswer(question.id, option)}
                                    className="w-5 h-5 text-black border-gray-300 focus:ring-black"
                                  />
                                  <span className={`flex-1 ${showResult && isCorrect ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
                                    {option}
                                  </span>
                                  {showResult && isCorrect && <CheckCircle className="w-5 h-5 text-gray-700" />}
                                  {showResult && !isCorrect && isSelected && <XCircle className="w-5 h-5 text-gray-400" />}
                                </label>
                              );
                            })}
                          </div>

                          {selected && (
                            <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                              <p className="text-gray-700 text-sm leading-relaxed">
                                <strong>Explanation:</strong> {question.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {quizComplete && (
                <div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-center gap-4 text-gray-800">
                    <CheckCircle className="w-6 h-6 text-gray-700" />
                    <div className="text-center">
                      <h3 className="font-semibold">Perfect! You understand key security.</h3>
                      <p className="text-gray-600">You're ready to continue safely.</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-center mt-8">
                <button
                  onClick={onBackupComplete}
                  disabled={!quizComplete}
                  className="rounded-xl py-4 px-8 font-semibold text-white bg-black border border-black
                             hover:bg-gray-900 transition-colors disabled:bg-gray-300 disabled:border-gray-300
                             disabled:text-white disabled:cursor-not-allowed"
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
