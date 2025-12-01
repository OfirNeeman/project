import React from 'react';

interface AvatarHeadProps {
    hairColor: string;
    eyeColor: string;
    skinTone: string;
}

export const AvatarHead: React.FC<AvatarHeadProps> = ({hairColor, eyeColor, skinTone}) => {
    return (
        <svg viewBox="0 0 100 100" className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 z-10">
            {/* Head shape */}
            <circle cx="50" cy="50" r="30" fill={skinTone} stroke="#44403c" strokeWidth="1" />
            
            {/* Eyes */}
            <g>
                <circle cx="40" cy="48" r="4" fill="#ffffff" />
                <circle cx="40" cy="48" r="2.5" fill={eyeColor} />
                <circle cx="60" cy="48" r="4" fill="#ffffff" />
                <circle cx="60" cy="48" r="2.5" fill={eyeColor} />
            </g>

            {/* Hair */}
            <g>
                <path d="M20 50 C 20 10, 80 10, 80 50 L 78 60 Q 50 70, 22 60 Z" fill={hairColor} />
                <path d="M40 12 C 30 15, 30 30, 45 30" stroke={hairColor} strokeWidth="8" fill="none" strokeLinecap="round"/>
            </g>
        </svg>
    )
}