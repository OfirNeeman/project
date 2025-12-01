import React from 'react';
import { UserProfile } from '../../types';
import { BodyShapeSVG } from './BodyShapes';
import { AvatarHead } from './AvatarHead';

export const Avatar: React.FC<{ profile: UserProfile }> = ({ profile }) => {
  return (
    <div className="relative w-36 h-72 mx-auto" aria-label="User avatar">
        <div className="absolute inset-0 flex items-end justify-center">
            <BodyShapeSVG shape={profile.bodyShape} skinTone={profile.skinTone} />
        </div>
        <AvatarHead 
            hairColor={profile.hairColor} 
            eyeColor={profile.eyeColor} 
            skinTone={profile.skinTone} 
        />
    </div>
  );
};
