export enum BodyShape {
  HOURGLASS = 'Hourglass',
  PEAR = 'Pear',
  APPLE = 'Apple',
  RECTANGLE = 'Rectangle',
  INVERTED_TRIANGLE = 'Inverted Triangle',
}

export enum Aesthetic {
  MINIMALIST = 'Minimalist',
  VINTAGE = 'Vintage',
  BOHEMIAN = 'Bohemian',
  STREETWEAR = 'Streetwear',
  PREPPY = 'Preppy',
  GRUNGE = 'Grunge',
  ARTY = 'Arty',
}

export interface UserProfile {
  aesthetic: Aesthetic;
  bodyShape: BodyShape;
  hairColor: string;
  skinTone: string;
  eyeColor: string;
}

export interface ClothingItem {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
}

export interface StyleRecommendation {
  colorPalette: {
    name: string;
    hexCodes: string[];
    description: string;
  };
  styleAdvice: string;
  recommendedItems: ClothingItem[];
}

export interface User {
  username: string;
  profile: UserProfile;
  savedItems: ClothingItem[];
}
