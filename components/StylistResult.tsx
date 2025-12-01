import React, { useState, useEffect } from 'react';
import { StyleRecommendation, UserProfile, ClothingItem } from '../types';
import { getStyleRecommendations } from '../services/geminiService';
import { SparklesIcon, HeartIcon, HeartIconFilled } from './icons';
import { Avatar } from './avatar/Avatar';

// Debounce hook to prevent excessive API calls on rapid input changes
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center text-center p-8">
        <SparklesIcon className="w-16 h-16 text-pink-500 animate-pulse" />
        <h3 className="text-2xl font-semibold mt-4">Curating your style...</h3>
        <p className="text-stone-600 mt-2">Our AI stylist is analyzing your profile to find the perfect looks.</p>
    </div>
);

const ProductCard: React.FC<{ item: ClothingItem, onSaveToggle: (item: ClothingItem) => void, isSaved: boolean }> = ({ item, onSaveToggle, isSaved }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300 flex flex-col">
        <div className="relative">
            <img src={item.imageUrl} alt={item.name} className="w-full h-64 object-cover" />
            <button 
                onClick={() => onSaveToggle(item)}
                className="absolute top-3 right-3 bg-white/70 backdrop-blur-sm rounded-full p-2 text-pink-500 hover:text-white hover:bg-pink-500 transition-all duration-200 transform hover:scale-110"
                aria-label={isSaved ? 'Unsave item' : 'Save item'}
            >
                {isSaved ? <HeartIconFilled className="w-6 h-6" /> : <HeartIcon className="w-6 h-6" />}
            </button>
        </div>
        <div className="p-4 flex flex-col flex-grow">
            <h4 className="text-lg font-bold truncate">{item.name}</h4>
            <p className="text-stone-600 text-sm mt-1">{item.category}</p>
            <p className="text-2xl font-bold text-pink-600 mt-2">${item.price.toFixed(2)}</p>
            <p className="text-stone-500 text-sm mt-2 flex-grow">{item.description}</p>
        </div>
    </div>
);


interface StylistResultProps {
  profile: UserProfile;
  savedItems: ClothingItem[];
  onSaveToggle: (item: ClothingItem) => void;
}

export const StylistResult: React.FC<StylistResultProps> = ({ profile, savedItems, onSaveToggle }) => {
  const [recommendation, setRecommendation] = useState<StyleRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [budget, setBudget] = useState(100);
  const [clothingType, setClothingType] = useState('Dress');

  const debouncedBudget = useDebounce(budget, 750);
  const debouncedClothingType = useDebounce(clothingType, 750);

  const isItemSaved = (item: ClothingItem) => {
    return savedItems.some(saved => saved.imageUrl === item.imageUrl);
  }

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!debouncedClothingType.trim()) {
        setRecommendation(null);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const result = await getStyleRecommendations(profile, debouncedBudget, debouncedClothingType);
        setRecommendation(result);
      } catch (err) {
        const errorString = JSON.stringify(err);
        if (errorString.includes("429") || errorString.includes("RESOURCE_EXHAUSTED")) {
             setError("Our AI is very popular right now! Please wait a moment before refining your search.");
        } else {
             setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecommendations();

  }, [profile, debouncedBudget, debouncedClothingType]);
  
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-xl p-6 mb-8 sticky top-4 z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div>
                <label htmlFor="clothingType" className="block text-sm font-medium text-stone-700">Clothing Type</label>
                <input
                    type="text"
                    id="clothingType"
                    value={clothingType}
                    onChange={(e) => setClothingType(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm p-2"
                    placeholder="e.g., Summer Dress"
                />
            </div>
            <div>
                <label htmlFor="budget" className="block text-sm font-medium text-stone-700">Max Budget: ${budget}</label>
                <input
                    type="range"
                    id="budget"
                    min="20"
                    max="500"
                    step="10"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="mt-1 block w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
            </div>
        </div>
         {loading && <p className="text-sm text-stone-500 text-center mt-2 animate-pulse">Updating results...</p>}
      </div>

      {loading && !recommendation && <LoadingSpinner />}
      {error && <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>}

      {recommendation && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-xl shadow-xl p-6 flex flex-col items-center">
                <h3 className="text-2xl font-bold mb-4">Your Avatar</h3>
                <Avatar profile={profile} />
            </div>
            {recommendation.colorPalette && (
                <div className="bg-white rounded-xl shadow-xl p-6">
                    <h3 className="text-2xl font-bold mb-4">{recommendation.colorPalette.name} Palette</h3>
                    <p className="text-stone-600 mb-4">{recommendation.colorPalette.description}</p>
                    <div className="flex flex-wrap gap-2">
                        {recommendation.colorPalette.hexCodes?.map((hex, index) => (
                        <div key={index} className="w-10 h-10 rounded-full border-2 border-white shadow-md" style={{ backgroundColor: hex }} title={hex}></div>
                        ))}
                    </div>
                </div>
            )}
            {recommendation.styleAdvice && (
                <div className="bg-white rounded-xl shadow-xl p-6">
                    <h3 className="text-2xl font-bold mb-4">Style Advice</h3>
                    <p className="text-stone-600 leading-relaxed">{recommendation.styleAdvice}</p>
                </div>
            )}
          </div>

          <div className="lg:col-span-2">
              <h3 className="text-3xl font-bold mb-6 text-center lg:text-left">Your Personalized Items</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {recommendation.recommendedItems?.map((item, index) => (
                    <ProductCard 
                      key={item.imageUrl + index} 
                      item={item}
                      onSaveToggle={onSaveToggle}
                      isSaved={isItemSaved(item)}
                    />
                ))}
              </div>
          </div>
        </div>
      )}
    </div>
  );
};
