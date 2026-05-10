export interface Testimonial {
  id: string;
  name: string;
  location: string;
  photo: string;
  rating: number;
  text: string;
  product: string;
}
export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Zara M.',
    location: 'Dubai, UAE',
    photo: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=200',
    rating: 5,
    text: 'Obsidian Noir is UNREAL. Every time I wear it, someone asks what I\'m wearing. The longevity is incredible — still going strong 10 hours later. This is my signature scent now.',
    product: 'Obsidian Noir',
  },
  {
    id: '2',
    name: 'Aria K.',
    location: 'London, UK',
    photo: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=200',
    rating: 5,
    text: 'Golden Oud surpassed every expectation. I\'ve tried countless oud fragrances but this one has a unique warmth that feels luxurious yet modern. The bottle itself is a piece of art.',
    product: 'Golden Oud',
  },
  {
    id: '3',
    name: 'Kai T.',
    location: 'Tokyo, Japan',
    photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
    rating: 5,
    text: 'Phantom Smoke is exactly what the name promises. Dark, mysterious, and completely addictive. I ordered 3 bottles because I was scared it would sell out.',
    product: 'Phantom Smoke',
  },
  {
    id: '4',
    name: 'Sofia R.',
    location: 'Milan, Italy',
    photo: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200',
    rating: 5,
    text: 'Velvet Rose doesn\'t smell like every other rose fragrance. There\'s something different about it — darker, more complex. It\'s romantic but not sweet. Absolutely love it.',
    product: 'Velvet Rose',
  },
  {
    id: '5',
    name: 'Marcus J.',
    location: 'New York, USA',
    photo: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200',
    rating: 5,
    text: 'Arctic Pulse is my summer staple. Clean and fresh without being generic. It smells expensive. The WhatsApp ordering was fast and the packaging is insane — premium all the way.',
    product: 'Arctic Pulse',
  },
  {
    id: '6',
    name: 'Layla H.',
    location: 'Cairo, Egypt',
    photo: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=200',
    rating: 5,
    text: 'Amber Ritual is my forever scent. It smells like incense, warmth, and something sacred. Every compliment I\'ve gotten in the last year has been about this fragrance.',
    product: 'Amber Ritual',
  },
];
