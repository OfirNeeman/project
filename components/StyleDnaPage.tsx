import React from 'react';
import { UserProfile } from '../types';
import { Avatar } from './avatar/Avatar';
import { ChevronLeftIcon } from './icons';

interface StyleDnaPageProps {
  profile: UserProfile;
  onEdit: () => void;
  onBack: () => void;
}

const DetailCard = ({ label, value, colorSwatch }: { label: string; value: string; colorSwatch?: string }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
        <div>
            <p className="text-sm text-stone-500">{label}</p>
            <p className="font-bold text-stone-800 text-lg">{value}</p>
        </div>
        {colorSwatch && <div className="w-8 h-8 rounded-full border-2 border-stone-200" style={{backgroundColor: colorSwatch}}></div>}
    </div>
)

export const StyleDnaPage: React.FC<StyleDnaPageProps> = ({ profile, onEdit, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="flex items-center mb-8">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-stone-200 transition-colors mr-4">
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <h2 className="text-4xl font-bold">My Style DNA</h2>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 bg-white rounded-xl shadow-xl p-6 flex flex-col items-center justify-center">
            <h3 className="text-2xl font-bold mb-4">Your Avatar</h3>
            <Avatar profile={profile} />
          </div>

          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-xl p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold">Your Profile</h3>
                    <button onClick={onEdit} className="font-bold text-pink-600 hover:text-pink-800 transition-colors">
                        Edit Profile
                    </button>
                </div>
                <div className="space-y-4">
                    <DetailCard label="Aesthetic" value={profile.aesthetic} />
                    <DetailCard label="Body Shape" value={profile.bodyShape} />
                    <DetailCard label="Skin Tone" value={profile.skinTone} colorSwatch={profile.skinTone} />
                    <DetailCard label="Hair Color" value={profile.hairColor} colorSwatch={profile.hairColor} />
                    <DetailCard label="Eye Color" value={profile.eyeColor} colorSwatch={profile.eyeColor} />
                </div>
            </div>
          </div>
      </div>
    </div>
  );
};
