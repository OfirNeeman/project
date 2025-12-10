import React, { useState, useEffect } from 'react';
import { User, UserProfile, ClothingItem } from './types';
import { AuthPage } from './components/AuthPage';
import { ProfileForm } from './components/ProfileForm';
import { MainApp } from './components/MainApp';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user on app start
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:4000/get-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
        const data = await response.json();
        if (response.ok) {
          setCurrentUser(data.user);
        } else {
          console.error('Failed to fetch user:', data.message);
          localStorage.removeItem('token');
        }
      } catch (err) {
        console.error('Network error:', err);
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('token');
  };

  // Unified handleProfileComplete
  const handleProfileComplete = async (profile: UserProfile) => {
    if (!currentUser) return;
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:4000/save-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: currentUser.username, token, profile }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const updatedUser = { ...currentUser, profile: data.profile };
        setCurrentUser(updatedUser);
      } else {
        console.error('Failed to save profile:', data.message);
      }
    } catch (err) {
      console.error('Network error:', err);
    }
  };

  const handleSaveToggle = (item: ClothingItem) => {
    if (!currentUser) return;

    const isSaved = currentUser.savedItems.some(saved => saved.imageUrl === item.imageUrl);
    const updatedItems = isSaved
      ? currentUser.savedItems.filter(saved => saved.imageUrl !== item.imageUrl)
      : [...currentUser.savedItems, item];

    setCurrentUser({ ...currentUser, savedItems: updatedItems });
  };

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
          <h1 className="text-5xl font-extrabold text-stone-800">
            Welcome, {currentUser.username}!
          </h1>
          <p className="text-stone-600 mt-2 max-w-lg">
            Let's create your style profile to unlock personalized recommendations.
          </p>
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
