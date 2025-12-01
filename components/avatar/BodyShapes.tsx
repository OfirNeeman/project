import React from 'react';
import { BodyShape } from '../../types';

interface BodyShapeSVGProps {
  shape: BodyShape;
  skinTone: string;
}

const commonProps = {
    stroke: "#44403c",
    strokeWidth: "1",
    fillOpacity: "1"
};

export const BodyShapeSVG: React.FC<BodyShapeSVGProps> = ({ shape, skinTone }) => {
  const SvgPath = () => {
      switch (shape) {
          case BodyShape.HOURGLASS:
              return <path d="M25,0 h50 v25 c0,25 -25,25 -25,50 s25,25 25,50 v25 h-50 v-25 c0,-25 25,-25 25,-50 s-25,-25 -25,-50 z" />;
          case BodyShape.PEAR:
              return <path d="M30,0 h40 v25 c0,20 -10,30 -10,50 s20,35 20,65 h-60 c0,-30 20,-30 20,-65 s-10,-30 -10,-50 z" />;
          case BodyShape.APPLE:
              return <path d="M25,0 h50 c15,25 15,60 0,85 s-15,60 0,85 h-50 c-15,-25 -15,-60 0,-85 s15,-60 0,-85 z" />;
          case BodyShape.RECTANGLE:
              return <path d="M25,0 h50 v150 h-50 z" />;
          case BodyShape.INVERTED_TRIANGLE:
              return <path d="M15,0 h70 l-25,90 h-20 l-25,-90 z M38,90 h24 l5,60 h-34 z" />;
          default:
              return <path d="M25,0 h50 v150 h-50 z" />;
      }
  };

  return (
    <svg viewBox="-5 -5 110 160" className="w-full h-full">
        <g fill={skinTone} {...commonProps}>
            <SvgPath />
        </g>
    </svg>
  );
};