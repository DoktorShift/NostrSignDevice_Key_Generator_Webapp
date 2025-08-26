import React, { useState } from 'react';
import { User, ArrowRight, AlertCircle } from 'lucide-react';
import type { NostrProfile } from '../types/nostr';

interface ProfileEditorProps {
  profile: NostrProfile;
  onProfileUpdate: (profile: NostrProfile) => void;
  onNext: () => void;
}

export default function ProfileEditor({ profile, onProfileUpdate, onNext }: ProfileEditorProps) {
  const [localProfile, setLocalProfile] = useState<NostrProfile>(profile);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof NostrProfile, value: string) => {
    const updatedProfile = { ...localProfile, [field]: value };
    setLocalProfile(updatedProfile);
    onProfileUpdate(updatedProfile);
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleUrlBlur = (field: keyof NostrProfile, value: string) => {
    if (value && !validateUrl(value)) {
      setValidationErrors(prev => ({ 
        ...prev, 
        [field]: 'Please enter a valid URL (e.g., https://example.com)' 
      }));
    }
  };

  const handleEmailBlur = (field: keyof NostrProfile, value: string) => {
    if (value && !validateEmail(value)) {
      setValidationErrors(prev => ({ 
        ...prev, 
        [field]: 'Please enter a valid email address' 
      }));
    }
  };

  const InputField = ({ 
    label, 
    field, 
    type = 'text', 
    placeholder, 
    validation,
    maxLength
  }: {
    label: string;
    field: keyof NostrProfile;
    type?: string;
    placeholder: string;
    validation?: 'url' | 'email';
    maxLength?: number;
  }) => (
    <div className="space-y-2 relative">
      <label className="block text-sm font-medium text-slate-700">
        {label}
        {maxLength && (
          <span className="text-xs text-slate-500 ml-2">
            ({(localProfile[field] as string)?.length || 0}/{maxLength})
          </span>
        )}
      </label>
      
      <div className="relative">
        {type === 'textarea' ? (
          <textarea
            value={localProfile[field] || ''}
            onChange={(e) => handleChange(field, e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            rows={3}
            className={`w-full p-3 border rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 resize-none text-sm ${
              validationErrors[field] ? 'border-red-300 bg-red-50/50' : 'border-slate-200 hover:border-slate-300'
            }`}
          />
        ) : (
          <input
            type={type}
            value={localProfile[field] || ''}
            onChange={(e) => handleChange(field, e.target.value)}
            onBlur={(e) => {
              if (validation === 'url') handleUrlBlur(field, e.target.value);
              if (validation === 'email') handleEmailBlur(field, e.target.value);
            }}
            placeholder={placeholder}
            maxLength={maxLength}
            className={`w-full p-3 border rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-sm ${
              validationErrors[field] ? 'border-red-300 bg-red-50/50' : 'border-slate-200 hover:border-slate-300'
            }`}
          />
        )}
        
        {validationErrors[field] && (
          <div className="absolute -bottom-5 left-0 flex items-center text-red-600 text-xs">
            <AlertCircle className="w-4 h-4 mr-2" />
            {validationErrors[field]}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50/30 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-slate-800 to-black rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl border border-slate-300/30">
            <User className="w-8 h-8 text-white drop-shadow-lg" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            Create Your Profile
          </h1>
          <p className="text-slate-600 text-base max-w-lg mx-auto">
            All fields are optional. Add what you want to share.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200">
          <div className="space-y-6">
            <InputField
              label="Display Name"
              field="display_name"
              placeholder="John Doe"
              maxLength={100}
            />
            
            <InputField
              label="Username"
              field="name"
              placeholder="johndoe"
              maxLength={50}
            />
            
            <InputField
              label="About"
              field="about"
              type="textarea"
              placeholder="Tell people about yourself..."
              maxLength={500}
            />
            
            <InputField
              label="Profile Picture URL"
              field="picture"
              type="url"
              placeholder="https://example.com/photo.jpg"
              validation="url"
            />
            
            <InputField
              label="Website"
              field="website"
              type="url"
              placeholder="https://yoursite.com"
              validation="url"
            />
            
            <InputField
              label="Lightning Address"
              field="lud16"
              type="email"
              placeholder="you@getalby.com"
              validation="email"
            />
          </div>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={onNext}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 px-8 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200 flex items-center mx-auto"
          >
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}