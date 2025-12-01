import React, { useState, useEffect } from 'react';
import { UserProfile, BodyShape, Aesthetic } from '../types';

interface ProfileFormProps {
  onProfileComplete: (profile: UserProfile) => void;
  initialProfile?: UserProfile | null;
  onCancel?: () => void;
}

const colorOptions = {
    hair: [
        { name: 'Black', hex: '#2C1F18' },
        { name: 'Brunette', hex: '#6D4C3A' },
        { name: 'Blonde', hex: '#E6C68A' },
        { name: 'Auburn', hex: '#9B4A2B' },
        { name: 'Pastel Pink', hex: '#F4C2C2' },
        { name: 'Gray', hex: '#A9A9A9' },
    ],
    skin: [
        { name: 'Fair', hex: '#F9E4D4' },
        { name: 'Light', hex: '#F5D3B8' },
        { name: 'Medium', hex: '#D1A689' },
        { name: 'Tan', hex: '#A97556' },
        { name: 'Olive', hex: '#B58A6F' },
        { name: 'Deep', hex: '#5E3B29' },
    ],
    eyes: [
        { name: 'Blue', hex: '#6886A3' },
        { name: 'Green', hex: '#637A4C' },
        { name: 'Brown', hex: '#714D32' },
        { name: 'Hazel', hex: '#B0884F' },
        { name: 'Gray', hex: '#808080' },
        { name: 'Amber', hex: '#FFBF00' },
    ],
};

const bodyShapeImages: Record<BodyShape, { src: string; alt: string }> = {
    [BodyShape.HOURGLASS]: { src: 'https://picsum.photos/seed/hourglass/200/300', alt: 'Illustration of an hourglass body shape' },
    [BodyShape.PEAR]: { src: 'https://picsum.photos/seed/pear/200/300', alt: 'Illustration of a pear body shape' },
    [BodyShape.APPLE]: { src: 'https://picsum.photos/seed/apple/200/300', alt: 'Illustration of an apple body shape' },
    [BodyShape.RECTANGLE]: { src: 'https://picsum.photos/seed/rectangle/200/300', alt: 'Illustration of a rectangle body shape' },
    [BodyShape.INVERTED_TRIANGLE]: { src: 'https://picsum.photos/seed/invtriangle/200/300', alt: 'Illustration of an inverted triangle body shape' },
};


const ColorSwatch = ({ color, isSelected, onClick }: { color: string, isSelected: boolean, onClick: () => void }) => (
    <button
        type="button"
        onClick={onClick}
        className={`w-10 h-10 rounded-full border-2 transition-transform transform hover:scale-110 ${isSelected ? 'border-pink-500 scale-110 shadow-md' : 'border-white'}`}
        style={{ backgroundColor: color }}
        aria-label={color}
    />
);


export const ProfileForm: React.FC<ProfileFormProps> = ({ onProfileComplete, initialProfile = null, onCancel }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>(initialProfile || {});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialProfile) {
        setProfile(initialProfile);
    }
  }, [initialProfile]);
  
  const handleNext = () => {
    // Validation for current step
    if (step === 1 && !profile.aesthetic) {
      setError('Please select your aesthetic.');
      return;
    }
    if (step === 2 && !profile.bodyShape) {
      setError('Please select your body shape.');
      return;
    }
    if (step === 3 && (!profile.hairColor || !profile.skinTone || !profile.eyeColor)) {
      setError('Please select your hair, skin, and eye color.');
      return;
    }
    setError(null);
    if (step < 3) {
      setStep(step + 1);
    } else {
      onProfileComplete(profile as UserProfile);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const isEditing = !!initialProfile;

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-center">What's Your Vibe?</h2>
            <p className="text-center text-stone-600 mb-6">Select the aesthetic that speaks to you.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Object.values(Aesthetic).map((aes) => (
                <button
                  key={aes}
                  onClick={() => setProfile({ ...profile, aesthetic: aes })}
                  className={`p-4 border rounded-lg text-center transition-all duration-200 ${
                    profile.aesthetic === aes ? 'bg-pink-500 text-white border-pink-500 shadow-lg' : 'bg-white hover:border-pink-300 hover:shadow-md'
                  }`}
                >
                  {aes}
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-center">What's Your Body Shape?</h2>
            <p className="text-center text-stone-600 mb-6">This helps us find the most flattering fits. Select the image that best represents you.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {Object.values(BodyShape).map((shape) => (
                <button
                  key={shape}
                  onClick={() => setProfile({ ...profile, bodyShape: shape })}
                  className={`border-4 rounded-lg text-center transition-all duration-200 overflow-hidden group relative transform hover:-translate-y-1 ${
                    profile.bodyShape === shape ? 'border-pink-500 shadow-xl' : 'border-transparent hover:border-pink-300'
                  }`}
                >
                  <img src={bodyShapeImages[shape].src} alt={bodyShapeImages[shape].alt} className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className={`absolute bottom-0 left-0 right-0 p-2 text-white font-bold transition-colors duration-300 text-xs sm:text-sm ${
                      profile.bodyShape === shape ? 'bg-pink-500' : 'bg-black/40 group-hover:bg-pink-500/80'
                  }`}>{shape}</div>
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-center">Your Color Palette</h2>
            <p className="text-center text-stone-600 mb-6">Select your natural colors.</p>
            <div className="space-y-6">
               <div>
                  <h3 className="font-semibold mb-2 text-stone-700">Skin Tone</h3>
                  <div className="flex flex-wrap gap-3 p-2 bg-stone-50 rounded-lg">
                      {colorOptions.skin.map(color => (
                          <ColorSwatch
                              key={color.name}
                              color={color.hex}
                              isSelected={profile.skinTone === color.hex}
                              onClick={() => setProfile({ ...profile, skinTone: color.hex })}
                          />
                      ))}
                  </div>
              </div>
              <div>
                  <h3 className="font-semibold mb-2 text-stone-700">Hair Color</h3>
                  <div className="flex flex-wrap gap-3 p-2 bg-stone-50 rounded-lg">
                      {colorOptions.hair.map(color => (
                          <ColorSwatch
                              key={color.name}
                              color={color.hex}
                              isSelected={profile.hairColor === color.hex}
                              onClick={() => setProfile({ ...profile, hairColor: color.hex })}
                          />
                      ))}
                  </div>
              </div>
              <div>
                  <h3 className="font-semibold mb-2 text-stone-700">Eye Color</h3>
                  <div className="flex flex-wrap gap-3 p-2 bg-stone-50 rounded-lg">
                      {colorOptions.eyes.map(color => (
                          <ColorSwatch
                              key={color.name}
                              color={color.hex}
                              isSelected={profile.eyeColor === color.hex}
                              onClick={() => setProfile({ ...profile, eyeColor: color.hex })}
                          />
                      ))}
                  </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-8 bg-stone-100/80 backdrop-blur-sm rounded-xl shadow-2xl">
        <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-pink-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }}></div>
            </div>
        </div>
    
        {renderStep()}

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        
        <div className="flex justify-between mt-8">
            {isEditing ? (
                 <button
                    onClick={onCancel}
                    className="px-6 py-2 bg-stone-300 text-stone-700 rounded-lg hover:bg-stone-400 transition-colors"
                    >
                    Cancel
                </button>
            ) : (
                <button
                onClick={handleBack}
                disabled={step === 1}
                className="px-6 py-2 bg-stone-300 text-stone-700 rounded-lg hover:bg-stone-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                Back
                </button>
            )}
            <button
            onClick={handleNext}
            className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
            >
            {step === 3 ? (isEditing ? 'Save Changes' : 'Get My Style!') : 'Next'}
            </button>
        </div>
    </div>
  );
};
