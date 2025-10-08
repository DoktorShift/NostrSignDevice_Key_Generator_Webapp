import React, { useState } from 'react';
import { X } from 'lucide-react';
import WelcomeSection from './components/WelcomeSection';
import KeyGenerationSection from './components/KeyGenerationSection';
import BackupSection from './components/BackupSection';
import ProfileEditor from './components/ProfileEditor';
import SummarySection from './components/SummarySection';
import RelaySection from './components/RelaySection';
import SuccessSection from './components/SuccessSection';
import type { AppMode, AppStep, KeyPair, NostrProfile } from './types/nostr';

function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>('welcome');
  const [keys, setKeys] = useState<KeyPair | null>(null);
  const [profile, setProfile] = useState<NostrProfile>({});
  const [showEscapeHint, setShowEscapeHint] = useState(false);

  const steps: AppStep[] = ['welcome', 'keys', 'backup', 'profile', 'relays', 'success'];
  const currentStepIndex = steps.indexOf(currentStep);

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    }
  };

  const handleKeysGenerated = (newKeys: KeyPair) => {
    setKeys(newKeys);
    handleNext();
  };

  const handleProfileUpdate = (newProfile: NostrProfile) => {
    setProfile(newProfile);
  };

  const handleEscape = () => {
    setCurrentStep('welcome');
    setKeys(null);
    setProfile({});
  };

  // Handle escape key press
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && currentStep !== 'welcome' && currentStep !== 'success') {
        handleEscape();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentStep]);

  // Show escape hint after 3 seconds on non-welcome steps
  React.useEffect(() => {
    if (currentStep !== 'welcome' && currentStep !== 'success') {
      const timer = setTimeout(() => {
        setShowEscapeHint(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    } else {
      setShowEscapeHint(false);
    }
  }, [currentStep]);

  // Progress indicator
  const ProgressIndicator = () => currentStep !== 'welcome' && currentStep !== 'success' ? (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="font-bold text-gray-800">Nostr Device Setup</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 font-medium">
              Step {currentStepIndex} of {steps.length - 2}
            </span>
            <div className="flex space-x-2">
              {steps.slice(1, -1).map((step, index) => (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index < currentStepIndex - 1 && currentStepIndex > 1
                      ? 'bg-purple-600 shadow-sm'
                      : index === currentStepIndex - 1 && currentStepIndex > 1
                      ? 'bg-purple-400 ring-2 ring-purple-200'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Escape Button */}
        <button
          onClick={handleEscape}
          className="fixed top-4 right-4 p-2 bg-white/90 hover:bg-white border border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50 group"
          title="Return to start (ESC)"
        >
          <X className="w-5 h-5 text-gray-600 group-hover:text-red-500 transition-colors" />
        </button>
      </div>
    </div>
  ) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-white to-gray-50">
      <ProgressIndicator />
      
      <main className={currentStep !== 'welcome' && currentStep !== 'success' ? 'pt-16' : ''}>
        {/* Escape Hint */}
        {showEscapeHint && currentStep !== 'welcome' && currentStep !== 'success' && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm flex items-center space-x-2 shadow-xl">
              <span>Press</span>
              <kbd className="bg-white/20 px-2 py-1 rounded text-xs font-mono">ESC</kbd>
              <span>to start over</span>
            </div>
          </div>
        )}

        {currentStep === 'welcome' && (
          <WelcomeSection onNext={handleNext} />
        )}

        {currentStep === 'keys' && (
          <KeyGenerationSection
            onKeysGenerated={handleKeysGenerated}
          />
        )}

        {currentStep === 'backup' && keys && (
          <BackupSection
            keys={keys}
            onBackupComplete={handleNext}
          />
        )}

        {currentStep === 'profile' && (
          <ProfileEditor
            profile={profile}
            onProfileUpdate={handleProfileUpdate}
            onNext={handleNext}
          />
        )}

        {currentStep === 'relays' && keys && (
          <RelaySection
            profile={profile}
            keys={keys}
            onPublishComplete={handleNext}
          />
        )}

        {currentStep === 'success' && keys && (
          <SuccessSection
            keys={keys}
            profile={profile}
          />
        )}
      </main>
      
    </div>
  );
}

export default App;