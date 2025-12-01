
import React, { useState, useEffect } from 'react';
import { User, UserProfile, ClothingItem } from './types';
import { AuthPage } from './components/AuthPage';
import { ProfileForm } from './components/ProfileForm';
import { MainApp } from './components/MainApp';

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Effect to check for a logged-in user in localStorage on initial load
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('currentUser');
            if (storedUser) {
                setCurrentUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
        }
        setIsLoading(false);
    }, []);

    // Effect to update localStorage whenever the currentUser state changes
    useEffect(() => {
        if (currentUser) {
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        } else {
            localStorage.removeItem('currentUser');
        }
    }, [currentUser]);

    const handleLogout = () => {
        setCurrentUser(null);
    };

    const handleProfileComplete = (profile: UserProfile) => {
        if (currentUser) {
            const updatedUser = { ...currentUser, profile };
            setCurrentUser(updatedUser);

            // Also update the master user list in localStorage
            const users = JSON.parse(localStorage.getItem('users') || '{}');
            users[currentUser.username].profile = profile;
            localStorage.setItem('users', JSON.stringify(users));
        }
    };
    
    const handleSaveToggle = (item: ClothingItem) => {
        if (!currentUser) return;
        
        const isSaved = currentUser.savedItems.some(saved => saved.imageUrl === item.imageUrl);
        let updatedItems;

        if (isSaved) {
            updatedItems = currentUser.savedItems.filter(saved => saved.imageUrl !== item.imageUrl);
        } else {
            updatedItems = [...currentUser.savedItems, item];
        }

        const updatedUser = { ...currentUser, savedItems: updatedItems };
        setCurrentUser(updatedUser);
    }


    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-stone-100">
                <p>Loading...</p>
            </div>
        );
    }
    
    if (!currentUser) {
        return <AuthPage onLoginSuccess={setCurrentUser} />;
    }

    if (!currentUser.profile) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-pink-50 to-stone-100">
                <header className="text-center mb-8">
                    <h1 className="text-5xl font-extrabold text-stone-800">Welcome, {currentUser.username}!</h1>
                    <p className="text-stone-600 mt-2 max-w-lg">Let's create your style profile to unlock personalized recommendations.</p>
                </header>
                <ProfileForm onProfileComplete={handleProfileComplete} />
            </div>
        );
    }

    return (
        <MainApp 
            user={currentUser} 
            onLogout={handleLogout}
            onSaveToggle={handleSaveToggle}
            onProfileUpdate={handleProfileComplete}
        />
    );
};

export default App;
