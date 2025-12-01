import React from 'react';
import { User } from '../types';
import { Avatar } from './avatar/Avatar';
import { SparklesIcon, LogoutIcon, ClosetIcon, DnaIcon } from './icons';

interface ProfileHubProps {
  user: User;
  onLogout: () => void;
  onNavigate: (page: 'STYLIST' | 'SAVED_CLOSET' | 'STYLE_DNA') => void;
}

const HubCard = ({ icon, title, description, onClick }: { icon: React.ReactElement, title: string, description: string, onClick: () => void }) => (
    <button onClick={onClick} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-left w-full flex items-center gap-6">
        <div className="bg-pink-100 text-pink-600 p-4 rounded-full">
            {icon}
        </div>
        <div>
            <h3 className="text-xl font-bold text-stone-800">{title}</h3>
            <p className="text-stone-600">{description}</p>
        </div>
    </button>
);

export const ProfileHub: React.FC<ProfileHubProps> = ({ user, onLogout, onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-stone-100 flex flex-col items-center p-4 sm:p-8">
        <div className="w-full max-w-2xl text-center">
            <div className="relative inline-block mb-4">
                 <Avatar profile={user.profile} />
                 <button onClick={onLogout} className="absolute -top-2 -right-2 bg-white rounded-full p-2 shadow-md text-stone-600 hover:bg-red-500 hover:text-white transition-colors">
                    <LogoutIcon className="w-5 h-5" />
                 </button>
            </div>
           
            <h1 className="text-4xl font-bold text-stone-800">Welcome back, {user.username}!</h1>
            <p className="text-stone-600 mt-2">What would you like to do today?</p>
            
            <div className="space-y-6 mt-10">
                <HubCard 
                    icon={<SparklesIcon className="w-8 h-8"/>}
                    title="Find My Style"
                    description="Get personalized recommendations from your AI stylist."
                    onClick={() => onNavigate('STYLIST')}
                />
                <HubCard 
                    icon={<ClosetIcon className="w-8 h-8"/>}
                    title="My Saved Closet"
                    description="View and manage your saved clothing items."
                    onClick={() => onNavigate('SAVED_CLOSET')}
                />
                <HubCard 
                    icon={<DnaIcon className="w-8 h-8"/>}
                    title="My Style DNA"
                    description="View or edit your style profile and preferences."
                    onClick={() => onNavigate('STYLE_DNA')}
                />
            </div>
        </div>
    </div>
  );
};
