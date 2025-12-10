// MainApp.tsx
import React from 'react';
import { User, ClothingItem, UserProfile } from '../types';

interface MainAppProps {
  user: User;
  onLogout: () => void;
  onSaveToggle: (item: ClothingItem) => void;
  onProfileUpdate: (profile: UserProfile) => void;
}

export const MainApp: React.FC<MainAppProps> = ({ user, onLogout, onSaveToggle, onProfileUpdate }) => {
  const handleAddSampleItem = () => {
    const sampleItem: ClothingItem = {
      name: "Red Dress",
      description: "Elegant red dress for evening events",
      price: 120,
      category: "Dress",
      imageUrl: "https://via.placeholder.com/150",
    };
    onSaveToggle(sampleItem);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-pink-50 to-stone-100 min-h-screen">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-stone-800">Hello, {user.username}!</h1>
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </header>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Your Profile:</h2>
        {user.profile ? (
          <div>
            <p>Body Shape: {user.profile.bodyShape}</p>
            <p>Aesthetic: {user.profile.aesthetic}</p>
            <p>Hair Color: {user.profile.hairColor}</p>
            <p>Skin Tone: {user.profile.skinTone}</p>
            <p>Eye Color: {user.profile.eyeColor}</p>
          </div>
        ) : (
          <p>Profile not set.</p>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Saved Items:</h2>
        {user.savedItems.length > 0 ? (
          <ul>
            {user.savedItems.map((item, idx) => (
              <li key={idx} className="mb-2">
                {item.name} - ${item.price}
                <button
                  onClick={() => onSaveToggle(item)}
                  className="ml-2 px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No saved items yet.</p>
        )}
        <button
          onClick={handleAddSampleItem}
          className="mt-4 px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
        >
          Add Sample Item
        </button>
      </section>
    </div>
  );
};

