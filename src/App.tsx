import React, { useState } from 'react';
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

  // Progress indicator
  const ProgressIndicator = () => currentStep !== 'welcome' && currentStep !== 'success' ? (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <img 
              src="https://github.com/DoktorShift/images/blob/main/buho_logo.png?raw=true" 
              alt="Buho Logo" 
              className="w-6 h-6"
            />
            <span className="font-bold text-gray-800">Buho</span>
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
                      ? 'bg-green-600 shadow-sm' 
                      : index === currentStepIndex - 1 && currentStepIndex > 1
                      ? 'bg-green-400 ring-2 ring-green-200' 
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-white to-green-50/30">
      <ProgressIndicator />
      
      <main className={currentStep !== 'welcome' && currentStep !== 'success' ? 'pt-16' : ''}>
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