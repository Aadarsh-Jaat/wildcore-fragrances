export type Category = 'Woody' | 'Floral' | 'Oud' | 'Fresh' | 'Oriental' | 'Unisex';

export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: Category;
  price: number;
  image: string;
  images: string[];
  notes: {
    top: string[];
    middle: string[];
    base: string[];
  };
  volumes: { ml: number; price: number }[];
  description: string;
  bestseller?: boolean;
  newArrival?: boolean;
  rating: number;
  reviews: number;
}

export const products: Product[] = [
  {
    id: 'wanted-x',
    name: 'Wanted X',
    tagline: 'Crave the extraordinary - Wanted X, the scent that refuses to go unnoticed.',
    category: 'Woody',
    price: 300,
    image: '/images/WantedX.png',
    images: [
      '/images/WantedX.png',
      'https://images.pexels.com/photos/1557890/pexels-photo-1557890.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    notes: {
      top: ['Pink Pepper', 'Cardamom'],
      middle: ['Levender', 'Sage'],
      base: ['Leathery', 'Chestnut'],
    },
    volumes: [
      { ml: 30, price: 300 },
      { ml: 50, price: 500 },
      { ml: 100, price: 900 },
    ],
    description: 'A bold, smoky fragrance that commands attention. Wanted X opens with a sharp spice kick before settling into a rich woody heart, leaving a trail of warm amber and dark musk.',
    bestseller: true,
    rating: 4.9,
    reviews: 214,
  },
  {
    id: 'berry-blush',
    name: 'Berry Blush',
    tagline: 'Romance without rules',
    category: 'Floral',
    price: 300,
    image: '/images/BeeryBlush.jpeg',
    images: [
      '/images/BeeryBlush.jpeg',
      '/images/Berry.png'
    ],
    notes: {
      top: ['Raspberry', 'Straberry'],
      middle: ['Jasmine', 'Peony', 'Datura'],
      base: ['Patchouli', 'White Musk', 'Ambrox'],
    },
    volumes: [
      { ml: 30, price: 300 },
      { ml: 50, price: 500 },
      { ml: 100, price: 900 },
    ],
    description: 'A lush, modern take on the classic rose. Berry Blush is powdery and romantic yet edgy — a rose that blooms in the dark.',
    bestseller: true,
    rating: 4.8,
    reviews: 189,
  },
  {
    id: 'oud-mirag',
    name: 'Oud Mirag',
    tagline: 'Ancient luxury, reimagined',
    category: 'Oud',
    price: 300,
    image: '/images/OudMirag.png',
    images: [
      '/images/OudMirag.png',
      'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    notes: {
      top: ['Saffron', 'Nutmeg', 'Lavender'],
      middle: ['Natural Oud Wood', 'Agarwood Oil'],
      base: ['Patchouli', 'Musk'],
    },
    volumes: [
      { ml: 30, price: 300 },
      { ml: 50, price: 500 },
      { ml: 100, price: 900 },
    ],
    description: 'The king of all fragrances. Oud Mirag layers precious agarwood with rare saffron and rose for an opulent, centuries-old accord elevated to modern luxury.',
    bestseller: false,
    newArrival: false,
    rating: 4.9,
    reviews: 97,
  },
  {
    id: 'aqua-storm',
    name: 'Aqua Storm',
    tagline: 'Ice cold confidence',
    category: 'Fresh',
    price: 300,
    image: '/images/AquaStorm.jpeg',
    images: [
      '/images/AquaStorm.jpeg',
    ],
    notes: {
      top: ['Mint', 'Bergamount'],
      middle: ['Neroli', 'Jasmin'],
      base: ['Amber', 'Lavender', 'Oakmoss'],
    },
    volumes: [
      { ml: 30, price: 300 },
      { ml: 50, price: 500 },
      { ml: 100, price: 900 },
    ],
    description: 'Ride the waves, feel the rush - Aqua Storm, power in every splash.',
    newArrival: true,
    rating: 4.7,
    reviews: 63,
  },
  {
    id: 'flower-punch',
    name: 'Flower Punch',
    tagline: 'Ritual of the senses',
    category: 'Oriental',
    price: 300,
    image: '/images/FlowerPunch.jpeg',
    images: [
      '/images/FlowerPunch.jpeg',
    ],
    notes: {
      top: ['Citrus', 'Pear Blossom'],
      middle: ['Peony', 'Gardenia'],
      base: ['Patchouli', 'White Rose', 'Saffron'],
    },
    volumes: [
      { ml: 30, price: 300 },
      { ml: 50, price: 500 },
      { ml: 100, price: 900 },
    ],
    description: 'An intoxicating oriental that wraps you in warmth. Flower Punch is meditative, sensual, and deeply addictive — for those who know their power.',
    bestseller: false,
    rating: 4.8,
    reviews: 142,
  },
  {
    id: 'rebelian',
    name: 'Rebelian',
    tagline: 'Vanish into the night',
    category: 'Unisex',
    price: 900,
    image: '/images/rebelian.jpg',
    images: [
      '/images/rebelian.jpg',
    ],
    notes: {
      top: ['Pineapple', 'Mandarin', 'Granny Smith apple'],
      middle: ['Cedarwood', 'Venilla', 'Oakmoss'],
      base: ['Dry Wood', 'Musk', 'Caramal'],
    },
    volumes: [
     { ml: 30, price: 450 },
      { ml: 50, price: 700 },
      { ml: 100, price: 1300 },
    ],
    description: 'A Rebelian in a bottle. Rebelian is shadowy, brooding, and utterly unique — the scent of disappearing acts and late-night mysteries.',
    newArrival: true,
    rating: 4.9,
    reviews: 78,
  },
  {
    id: 'iron-drift',
    name: 'Iron Drift',
    tagline: 'Untamed bloom',
    category: 'Floral',
    price: 300,
    image: '/images/IronDrift.jpeg',
    images: [
      '/images/IronDrift.jpeg',
    ],
    notes: {
      top: ['Cognae', 'Cinnamon'],
      middle: ['Nutmeg', 'Caramel'],
      base: ['Tonka Bean', 'Vanilla', 'Praline'],
    },
    volumes: [
      { ml: 30, price: 300 },
      { ml: 50, price: 500 },
      { ml: 100, price: 900 },
    ],
    description: 'Strength in every note, elegance in every drift - Iron Drift, built to last. ',
    newArrival: true,
    rating: 4.7,
    reviews: 55,
  },
  {
    id: 'aqua-storm',
    name: 'Aqua Storm - Solid Perfume',
    tagline: 'After the thunder, before the calm',
    category: 'Woody',
    price: 250,
    image: '/images/ASSolid.jpeg',
    images: [
      '/images/ASSolid.jpeg',
    ],
    notes: {
      top: ['Mint', 'Bergamot','Pepper'],
      middle: ['Patchouli', 'Vetiver', 'Pink Pepper'],
      base: ['Cedar', 'Ambroxan'],
    },
    volumes: [
      { ml : 12, price: 250 },

    ],
    description: 'The scent of rain hitting hot aqua bark. Aqua Storm captures nature\'s rawest, most dramatic moments in one bold fragrance.',
    bestseller: false,
    rating: 4.6,
    reviews: 89,
  },
];

export const collections = [
  {
    id: 'nights',
    name: 'The Night Collection',
    description: 'Dark, smoky, and seductive. For those who own the night.',
    image: '/images/collection1.png',
    count: 3,
  },
  {
    id: 'versatile',
    name: 'The Versatile Collection',
    description: 'Ancient ingredients, modern alchemy. Steeped in mysticism.',
    image: '/images/collection2.png',
    count: 2,
  },
  {
    id: 'fresh',
    name: 'The Aquatic Collection',
    description: 'Raw. Untamed. Alive. Fragrances that breathe with nature.',
    image: '/images/collection3.png',
    count: 3,
  },
];
