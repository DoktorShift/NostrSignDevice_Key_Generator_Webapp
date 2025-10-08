import React, { useState, useEffect } from 'react';
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

  // keep local state in sync if parent profile prop changes
  useEffect(() => {
    setLocalProfile(profile);
  }, [profile]);

  const handleChange = (field: keyof NostrProfile, value: string) => {
    const updatedProfile = { ...localProfile, [field]: value };
    setLocalProfile(updatedProfile);

    // clear validation as user types
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // debounced notify parent
  useEffect(() => {
    const id = setTimeout(() => onProfileUpdate(localProfile), 300);
    return () => clearTimeout(id);
  }, [localProfile, onProfileUpdate]);

  const validateUrl = (url: string): boolean => {
    try {
      // allow empty or full URL only
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // simple, fast
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

  type InputKind = 'text' | 'url' | 'email' | 'textarea';

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
    type?: InputKind;
    placeholder: string;
    validation?: 'url' | 'email';
    maxLength?: number;
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-800">
        {label}
        {typeof maxLength === 'number' && (
          <span className="text-xs text-gray-500 ml-2">
            ({(localProfile[field] as string)?.length || 0}/{maxLength})
          </span>
        )}
      </label>

      <div className="relative">
        {type === 'textarea' ? (
          <textarea
            value={(localProfile[field] as string) || ''}
            onChange={(e) => handleChange(field, e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            rows={4}
            className={`w-full p-3 rounded-xl border bg-white text-gray-900 placeholder-gray-400
                        focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition
                        ${validationErrors[field] ? 'border-red-300' : 'border-gray-300 hover:border-gray-400'} resize-none text-sm`}
          />
        ) : (
          <input
            type={type}
            value={(localProfile[field] as string) || ''}
            onChange={(e) => handleChange(field, e.target.value)}
            onBlur={(e) => {
              if (validation === 'url') handleUrlBlur(field, e.target.value);
              if (validation === 'email') handleEmailBlur(field, e.target.value);
            }}
            placeholder={placeholder}
            maxLength={maxLength}
            className={`w-full p-3 rounded-xl border bg-white text-gray-900 placeholder-gray-400
                        focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition
                        ${validationErrors[field] ? 'border-red-300' : 'border-gray-300 hover:border-gray-400'} text-sm`}
          />
        )}

        {validationErrors[field] && (
          <div className="absolute -bottom-5 left-0 flex items-center text-red-600 text-xs">
            <AlertCircle className="w-4 h-4 mr-1.5" />
            {validationErrors[field]}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-2xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-200 bg-gray-50">
            <User className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Setup Device Profile</h1>
          <p className="text-gray-600 text-base max-w-lg mx-auto mt-2">
            Configure your initial profile for the signing device. All fields optional.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
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

        {/* CTA */}
        <div className="text-center mt-6">
          <button
            onClick={onNext}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white
                       py-3 px-8 rounded-xl font-semibold text-base transition-colors"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
