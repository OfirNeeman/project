import React, { useState } from 'react';
import { User, UserProfile, ClothingItem } from '../types';
import { StylistResult } from './StylistResult';
import { CommunityPage } from './CommunityPage';
import { BlogPage } from './BlogPage';
import { ProfileHub } from './ProfileHub';
import { SavedClosetPage } from './SavedClosetPage';
import { StyleDnaPage } from './StyleDnaPage';
import { ProfileForm } from './ProfileForm';
import { SparklesIcon, HeartIcon, BookOpenIcon, UserIcon } from './icons';

type Page = 'HUB' | 'STYLIST' | 'COMMUNITY' | 'BLOG' | 'SAVED_CLOSET' | 'STYLE_DNA' | 'EDIT_PROFILE';

interface MainAppProps {
    user: User;
    onLogout: () => void;
    onSaveToggle: (item: ClothingItem) => void;
    onProfileUpdate: (profile: UserProfile) => void;
}

const NavItem = ({ icon, label, isActive, onClick }: { icon: React.ReactElement, label: string, isActive: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center space-y-1 w-20 px-2 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
            isActive ? 'bg-pink-500 text-white shadow-md' : 'text-stone-500 hover:bg-pink-100 hover:text-pink-600'
        }`}
    >
        {icon}
        <span>{label}</span>
    </button>
);


export const MainApp: React.FC<MainAppProps> = ({ user, onLogout, onSaveToggle, onProfileUpdate }) => {
    const [currentPage, setCurrentPage] = useState<Page>('STYLIST');
    
    const handleProfileUpdateAndNavigate = (profile: UserProfile) => {
        onProfileUpdate(profile);
        setCurrentPage('STYLE_DNA');
    }

    const renderPage = () => {
        switch (currentPage) {
            case 'HUB':
                return <ProfileHub user={user} onLogout={onLogout} onNavigate={setCurrentPage} />;
            case 'STYLIST':
                return <StylistResult profile={user.profile} savedItems={user.savedItems} onSaveToggle={onSaveToggle} />;
            case 'COMMUNITY':
                return <CommunityPage />;
            case 'BLOG':
                return <BlogPage />;
            case 'SAVED_CLOSET':
                return <SavedClosetPage items={user.savedItems} onRemove={onSaveToggle} onBack={() => setCurrentPage('HUB')} />;
            case 'STYLE_DNA':
                return <StyleDnaPage profile={user.profile} onEdit={() => setCurrentPage('EDIT_PROFILE')} onBack={() => setCurrentPage('HUB')} />;
            case 'EDIT_PROFILE':
                return (
                    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-pink-50 to-stone-100">
                        <header className="text-center mb-8">
                            <h1 className="text-4xl font-extrabold text-stone-800">Edit Your Style DNA</h1>
                            <p className="text-stone-600 mt-2 max-w-lg">Refine your preferences to get even better recommendations.</p>
                        </header>
                         <ProfileForm 
                            initialProfile={user.profile}
                            onProfileComplete={handleProfileUpdateAndNavigate}
                            onCancel={() => setCurrentPage('STYLE_DNA')}
                         />
                    </div>
                );
            default:
                return <StylistResult profile={user.profile} savedItems={user.savedItems} onSaveToggle={onSaveToggle} />;
        }
    };

    const showNavBar = currentPage !== 'EDIT_PROFILE';
    const isProfilePage = ['HUB', 'SAVED_CLOSET', 'STYLE_DNA'].includes(currentPage);

    return (
        <div className="min-h-screen bg-stone-100">
            <main className={showNavBar ? "pb-24" : ""}>
                {renderPage()}
            </main>

            {showNavBar && (
                 <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-stone-200 p-2 shadow-t-xl z-20">
                    <nav className="max-w-md mx-auto flex justify-around items-center">
                        <NavItem
                            icon={<SparklesIcon className="w-6 h-6" />}
                            label="Stylist"
                            isActive={currentPage === 'STYLIST'}
                            onClick={() => setCurrentPage('STYLIST')}
                        />
                        <NavItem
                            icon={<HeartIcon className="w-6 h-6" />}
                            label="Community"
                            isActive={currentPage === 'COMMUNITY'}
                            onClick={() => setCurrentPage('COMMUNITY')}
                        />
                        <NavItem
                            icon={<BookOpenIcon className="w-6 h-6" />}
                            label="Blog"
                            isActive={currentPage === 'BLOG'}
                            onClick={() => setCurrentPage('BLOG')}
                        />
                         <NavItem
                            icon={<UserIcon className="w-6 h-6" />}
                            label="Profile"
                            isActive={isProfilePage}
                            onClick={() => setCurrentPage('HUB')}
                        />
                    </nav>
                </footer>
            )}
        </div>
    );
};