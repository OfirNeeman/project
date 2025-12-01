
import React from 'react';
import { HeartIcon, ChatBubbleIcon } from './icons';

const OutfitCard = ({ user, outfitImg, likes, comments }: { user: string; outfitImg: string; likes: number; comments: number }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
    <div className="p-4 flex items-center gap-3">
      <img src={`https://i.pravatar.cc/40?u=${user}`} alt={user} className="w-10 h-10 rounded-full" />
      <span className="font-bold">{user}</span>
    </div>
    <img src={outfitImg} alt="Outfit" className="w-full h-auto" />
    <div className="p-4 flex justify-between items-center text-stone-600">
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 hover:text-pink-500 transition-colors">
          <HeartIcon />
          <span>{likes}</span>
        </button>
        <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
          <ChatBubbleIcon />
          <span>{comments}</span>
        </button>
      </div>
      <button className="text-sm font-semibold hover:text-stone-900">Save</button>
    </div>
  </div>
);

const QnaCard = ({ user, question, answers }: { user: string; question: string; answers: number }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center gap-3 mb-4">
            <img src={`https://i.pravatar.cc/40?u=${user}`} alt={user} className="w-10 h-10 rounded-full" />
            <div>
                <p className="font-bold">{user}</p>
                <p className="text-sm text-stone-500">2 hours ago</p>
            </div>
        </div>
        <p className="text-stone-800 mb-4">{question}</p>
        <div className="flex justify-between items-center text-sm text-stone-600">
            <span>{answers} people are helping</span>
            <button className="bg-pink-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-pink-600 transition-colors">Join Discussion</button>
        </div>
    </div>
);


export const CommunityPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-4xl font-bold text-center mb-8">Community Hub</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <h3 className="text-2xl font-bold mb-4">Trending Outfits</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <OutfitCard user="Olivia" outfitImg="https://picsum.photos/seed/outfit1/500/700" likes={1204} comments={88} />
                    <OutfitCard user="Ethan" outfitImg="https://picsum.photos/seed/outfit2/500/700" likes={987} comments={52} />
                    <OutfitCard user="Chloe" outfitImg="https://picsum.photos/seed/outfit3/500/700" likes={850} comments={31} />
                    <OutfitCard user="Liam" outfitImg="https://picsum.photos/seed/outfit4/500/700" likes={763} comments={45} />
                </div>
            </div>
            <div>
                <h3 className="text-2xl font-bold mb-4">Style Q&A</h3>
                <div className="space-y-6">
                    <QnaCard user="Sophie" question="Does this top go with these pants? Looking for honest feedback for a brunch date!" answers={12} />
                    <QnaCard user="Alex" question="What shoes should I wear with this dress for a formal event?" answers={25} />
                    <QnaCard user="Maya" question="How can I accessorize this to fit a 'bohemian' vibe? Any ideas welcome!" answers={18} />
                </div>
            </div>
        </div>
    </div>
  );
};
