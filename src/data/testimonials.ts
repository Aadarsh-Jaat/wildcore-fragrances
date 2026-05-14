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
    name: 'Nikita Madem',
    location: 'ABC, Odissa',
    photo: '/images/Test1.jpeg',
    rating: 5,
    text: 'Berry Blush is UNREAL. Every time I wear it, someone asks what I\'m wearing. The longevity is incredible — still going strong 10 hours later. This is my signature scent now.',
    product: 'Wanted X',
  },
  {
    id: '2',
    name: 'Arshdeep',
    location: 'Ganaur, India',
    photo: '/images/Test2.jpeg',
    rating: 5,
    text: 'Aqua Storm surpassed every expectation. I\'ve tried countless oud fragrances but this one has a unique warmth that feels luxurious yet modern. The bottle itself is a piece of art.',
    product: 'Oud Mirag',
  },
  {
    id: '3',
    name: 'Aakash Sangwan',
    location: 'Haryana, India',
    photo: '/images/Test3.jpeg',
    rating: 5,
    text: 'Wanted X is exactly what the name promises. Dark, mysterious, and completely addictive. I ordered 3 bottles because I was scared it would sell out.',
    product: 'Rebelian',
  },
  {
    id: '4',
    name: 'Vishva Vardhan Bhasham',
    location: 'Bangalore, Karnataka',
    photo: '/images/Test4.jpeg',
    rating: 5,
    text: 'Iron Drift doesn\'t smell like every other rose fragrance. There\'s something different about it — darker, more complex. It\'s romantic but not sweet. Absolutely love it.',
    product: 'Berry Blush',
  },
  {
    id: '5',
    name: 'Siddharth Rajput',
    location: 'Rai, India',
    photo: '/images/Test5.jpeg',
    rating: 5,
    text: 'Berry Blush is my summer staple. Clean and fresh without being generic. It smells expensive. The WhatsApp ordering was fast and the packaging is insane — premium all the way.',
    product: 'Aqua Storm',
  },
  {
    id: '6',
    name: 'Pawan',
    location: 'Rai, India',
    photo: '/images/Test6.jpeg',
    rating: 5,
    text: 'Wanted X is my forever scent. It smells like incense, warmth, and something sacred. Every compliment I\'ve gotten in the last year has been about this fragrance.',
    product: 'Flower Punch',
  },
];
