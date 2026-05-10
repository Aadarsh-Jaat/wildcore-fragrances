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
    id: 'obsidian-noir',
    name: 'Obsidian Noir',
    tagline: 'Dark as midnight, sharp as dawn',
    category: 'Woody',
    price: 89,
    image: 'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1557890/pexels-photo-1557890.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    notes: {
      top: ['Black Pepper', 'Bergamot', 'Cardamom'],
      middle: ['Vetiver', 'Cedarwood', 'Leather'],
      base: ['Sandalwood', 'Amber', 'Musk'],
    },
    volumes: [
      { ml: 30, price: 59 },
      { ml: 50, price: 89 },
      { ml: 100, price: 149 },
    ],
    description: 'A bold, smoky fragrance that commands attention. Obsidian Noir opens with a sharp spice kick before settling into a rich woody heart, leaving a trail of warm amber and dark musk.',
    bestseller: true,
    rating: 4.9,
    reviews: 214,
  },
  {
    id: 'velvet-rose',
    name: 'Velvet Rose',
    tagline: 'Romance without rules',
    category: 'Floral',
    price: 79,
    image: 'https://images.pexels.com/photos/1619488/pexels-photo-1619488.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/1619488/pexels-photo-1619488.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3059609/pexels-photo-3059609.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    notes: {
      top: ['Red Rose', 'Lychee', 'Pink Pepper'],
      middle: ['Jasmine', 'Peony', 'Iris'],
      base: ['Patchouli', 'White Musk', 'Vanilla'],
    },
    volumes: [
      { ml: 30, price: 49 },
      { ml: 50, price: 79 },
      { ml: 100, price: 129 },
    ],
    description: 'A lush, modern take on the classic rose. Velvet Rose is powdery and romantic yet edgy — a rose that blooms in the dark.',
    bestseller: true,
    rating: 4.8,
    reviews: 189,
  },
  {
    id: 'golden-oud',
    name: 'Golden Oud',
    tagline: 'Ancient luxury, reimagined',
    category: 'Oud',
    price: 129,
    image: 'https://images.pexels.com/photos/3059609/pexels-photo-3059609.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/3059609/pexels-photo-3059609.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    notes: {
      top: ['Saffron', 'Rose', 'Bergamot'],
      middle: ['Oud', 'Jasmine', 'Incense'],
      base: ['Amber', 'Sandalwood', 'Benzoin'],
    },
    volumes: [
      { ml: 30, price: 89 },
      { ml: 50, price: 129 },
      { ml: 100, price: 199 },
    ],
    description: 'The king of all fragrances. Golden Oud layers precious agarwood with rare saffron and rose for an opulent, centuries-old accord elevated to modern luxury.',
    bestseller: false,
    newArrival: false,
    rating: 4.9,
    reviews: 97,
  },
  {
    id: 'arctic-pulse',
    name: 'Arctic Pulse',
    tagline: 'Ice cold confidence',
    category: 'Fresh',
    price: 69,
    image: 'https://images.pexels.com/photos/1557890/pexels-photo-1557890.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/1557890/pexels-photo-1557890.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    notes: {
      top: ['Mint', 'Lemon', 'Sea Salt'],
      middle: ['Aquatic Accord', 'Ginger', 'White Tea'],
      base: ['Cedarwood', 'Light Musk', 'Driftwood'],
    },
    volumes: [
      { ml: 30, price: 45 },
      { ml: 50, price: 69 },
      { ml: 100, price: 109 },
    ],
    description: 'An electrifying blast of arctic freshness. Arctic Pulse hits like a cold wave — clean, crisp, and undeniably alive.',
    newArrival: true,
    rating: 4.7,
    reviews: 63,
  },
  {
    id: 'amber-ritual',
    name: 'Amber Ritual',
    tagline: 'Ritual of the senses',
    category: 'Oriental',
    price: 99,
    image: 'https://images.pexels.com/photos/1190829/pexels-photo-1190829.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/1190829/pexels-photo-1190829.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    notes: {
      top: ['Cinnamon', 'Cardamom', 'Orange Blossom'],
      middle: ['Amber', 'Frankincense', 'Labdanum'],
      base: ['Tonka Bean', 'Vanilla', 'Dark Musk'],
    },
    volumes: [
      { ml: 30, price: 65 },
      { ml: 50, price: 99 },
      { ml: 100, price: 169 },
    ],
    description: 'An intoxicating oriental that wraps you in warmth. Amber Ritual is meditative, sensual, and deeply addictive — for those who know their power.',
    bestseller: false,
    rating: 4.8,
    reviews: 142,
  },
  {
    id: 'phantom-smoke',
    name: 'Phantom Smoke',
    tagline: 'Vanish into the night',
    category: 'Unisex',
    price: 109,
    image: 'https://images.pexels.com/photos/3049148/pexels-photo-3049148.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/3049148/pexels-photo-3049148.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    notes: {
      top: ['Smoked Wood', 'Elemi', 'Black Currant'],
      middle: ['Birch Tar', 'Vetiver', 'Clary Sage'],
      base: ['Labdanum', 'Cashmeran', 'Oakmoss'],
    },
    volumes: [
      { ml: 30, price: 75 },
      { ml: 50, price: 109 },
      { ml: 100, price: 179 },
    ],
    description: 'A phantom in a bottle. Phantom Smoke is shadowy, brooding, and utterly unique — the scent of disappearing acts and late-night mysteries.',
    newArrival: true,
    rating: 4.9,
    reviews: 78,
  },
  {
    id: 'wild-jasmine',
    name: 'Wild Jasmine',
    tagline: 'Untamed bloom',
    category: 'Floral',
    price: 75,
    image: 'https://images.pexels.com/photos/2072179/pexels-photo-2072179.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/2072179/pexels-photo-2072179.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    notes: {
      top: ['Jasmine', 'Neroli', 'Green Leaves'],
      middle: ['Tuberose', 'Ylang-Ylang', 'Magnolia'],
      base: ['Musk', 'Benzoin', 'Cedarwood'],
    },
    volumes: [
      { ml: 30, price: 49 },
      { ml: 50, price: 75 },
      { ml: 100, price: 125 },
    ],
    description: 'Sun-drenched jasmine picked at golden hour. Wild Jasmine is intoxicating and free — a floral that refuses to be tamed.',
    newArrival: true,
    rating: 4.7,
    reviews: 55,
  },
  {
    id: 'cedar-storm',
    name: 'Cedar Storm',
    tagline: 'After the thunder, before the calm',
    category: 'Woody',
    price: 85,
    image: 'https://images.pexels.com/photos/3654772/pexels-photo-3654772.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/3654772/pexels-photo-3654772.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    notes: {
      top: ['Petrichor', 'Aldehydes', 'Cypress'],
      middle: ['Cedar', 'Vetiver', 'Geranium'],
      base: ['Oakmoss', 'Amber', 'Grey Musk'],
    },
    volumes: [
      { ml: 30, price: 55 },
      { ml: 50, price: 85 },
      { ml: 100, price: 145 },
    ],
    description: 'The scent of rain hitting hot cedar bark. Cedar Storm captures nature\'s rawest, most dramatic moments in one bold fragrance.',
    bestseller: false,
    rating: 4.6,
    reviews: 89,
  },
];

export const collections = [
  {
    id: 'noir',
    name: 'The Noir Collection',
    description: 'Dark, smoky, and seductive. For those who own the night.',
    image: 'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=1200',
    count: 3,
  },
  {
    id: 'ritual',
    name: 'The Ritual Collection',
    description: 'Ancient ingredients, modern alchemy. Steeped in mysticism.',
    image: 'https://images.pexels.com/photos/3059609/pexels-photo-3059609.jpeg?auto=compress&cs=tinysrgb&w=1200',
    count: 2,
  },
  {
    id: 'wild',
    name: 'The Wild Collection',
    description: 'Raw. Untamed. Alive. Fragrances that breathe with nature.',
    image: 'https://images.pexels.com/photos/2072179/pexels-photo-2072179.jpeg?auto=compress&cs=tinysrgb&w=1200',
    count: 3,
  },
];
