import React from 'react';
import { ClothingItem } from '../types';
import { ChevronLeftIcon, TrashIcon } from './icons';

const SavedItemCard: React.FC<{ item: ClothingItem; onRemove: (item: ClothingItem) => void }> = ({ item, onRemove }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden group relative">
    <img src={item.imageUrl} alt={item.name} className="w-full h-64 object-cover" />
    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
      <button 
        onClick={() => onRemove(item)}
        className="bg-red-500 text-white rounded-full p-3 transform scale-0 group-hover:scale-100 transition-transform duration-300"
        aria-label="Remove item"
      >
        <TrashIcon className="w-6 h-6" />
      </button>
    </div>
    <div className="p-4">
      <h4 className="font-bold truncate">{item.name}</h4>
      <p className="text-stone-600 text-sm">${item.price.toFixed(2)}</p>
    </div>
  </div>
);

interface SavedClosetPageProps {
  items: ClothingItem[];
  onRemove: (item: ClothingItem) => void;
  onBack: () => void;
}

export const SavedClosetPage: React.FC<SavedClosetPageProps> = ({ items, onRemove, onBack }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="flex items-center mb-8">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-stone-200 transition-colors mr-4">
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <h2 className="text-4xl font-bold">My Saved Closet</h2>
      </header>
      {items.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {items.map(item => (
            <SavedItemCard key={item.imageUrl} item={item} onRemove={onRemove} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-stone-300 rounded-xl">
          <h3 className="text-2xl font-semibold text-stone-700">Your closet is empty!</h3>
          <p className="text-stone-500 mt-2">Start exploring and save items you love.</p>
        </div>
      )}
    </div>
  );
};
