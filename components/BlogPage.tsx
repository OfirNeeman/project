
import React from 'react';

// FIX: Define props as a separate interface to resolve typing issue when spreading props with a key.
interface BlogPostCardProps {
    title: string;
    excerpt: string;
    image: string;
    author: string;
}

const BlogPostCard = ({ title, excerpt, image, author }: BlogPostCardProps) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden group">
        <div className="relative">
            <img src={image} alt={title} className="w-full h-56 object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all duration-300"></div>
        </div>
        <div className="p-6">
            <h3 className="text-2xl font-bold mb-2 group-hover:text-pink-600 transition-colors">{title}</h3>
            <p className="text-stone-500 mb-4 text-sm">By {author}</p>
            <p className="text-stone-600 leading-relaxed">{excerpt}</p>
            <button className="mt-4 font-bold text-pink-500 hover:text-pink-700 transition-colors">Read More &rarr;</button>
        </div>
    </div>
);

export const BlogPage: React.FC = () => {
    const posts = [
        {
            title: 'The Ultimate Guide to Color Theory in Fashion',
            excerpt: 'Unlock the secrets of the color wheel and discover which hues make you shine the brightest. From complementary colors to analogous schemes...',
            image: 'https://picsum.photos/seed/colorblog/600/400',
            author: 'Aria Montgomery',
        },
        {
            title: 'Dressing for Your Body Shape: Celebrating You',
            excerpt: 'Learn how to highlight your best features by understanding the principles of dressing for your unique body shape. It\'s all about balance and confidence.',
            image: 'https://picsum.photos/seed/shapeblog/600/400',
            author: 'Blake Lively',
        },
        {
            title: '5 Stylist Quotes That Will Change How You Dress',
            excerpt: '"Fashion is what you buy. Style is what you do with it." - We dive into iconic quotes from fashion legends and what they mean for your wardrobe.',
            image: 'https://picsum.photos/seed/quoteblog/600/400',
            author: 'Carrie Bradshaw',
        },
        {
            title: 'The Minimalist Wardrobe: Less is More',
            excerpt: 'Discover how to build a capsule wardrobe that is versatile, timeless, and effortlessly chic. Say goodbye to closet clutter and hello to intentional style.',
            image: 'https://picsum.photos/seed/minimalblog/600/400',
            author: 'Gwyneth Paltrow',
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold">Style Stories & Insights</h2>
                <p className="text-stone-600 mt-2">Your dose of fashion knowledge from the experts.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {posts.map((post, index) => (
                    <BlogPostCard key={index} {...post} />
                ))}
            </div>
        </div>
    );
};
