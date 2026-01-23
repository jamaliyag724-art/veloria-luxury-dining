export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Victoria Sterling',
    role: 'Food Critic, Michelin Guide',
    content: 'Veloria represents the pinnacle of fine dining. Every dish tells a story, and every bite is a revelation. The wagyu ribeye was transcendent.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
  },
  {
    id: '2',
    name: 'Alexander Hartley',
    role: 'CEO, Hartley Investments',
    content: 'We celebrated our 25th anniversary at Veloria. The service was impeccable, and the ambiance created memories that will last a lifetime.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
  },
  {
    id: '3',
    name: 'Isabella Romano',
    role: 'Celebrity Chef',
    content: 'As a chef myself, I appreciate the artistry behind each plate. Veloria has mastered the balance of innovation and tradition.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
  },
  {
    id: '4',
    name: 'Marcus Chen',
    role: 'Wine Sommelier',
    content: 'The wine pairing experience here is exceptional. Their cellar houses rare vintages that complement the cuisine perfectly.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
  },
  {
    id: '5',
    name: 'Sophia Laurent',
    role: 'Luxury Travel Blogger',
    content: 'Among all the restaurants I\'ve visited worldwide, Veloria stands out for its attention to detail and genuine hospitality.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
  },
];

export const faqs = [
  {
    question: 'Do you accommodate dietary restrictions?',
    answer: 'Absolutely. Our culinary team is experienced in preparing dishes for various dietary requirements including vegetarian, vegan, gluten-free, and allergen-specific needs. Please inform us when making your reservation.',
  },
  {
    question: 'Is there a dress code?',
    answer: 'We maintain a smart elegant dress code. Gentlemen are requested to wear collared shirts and dress shoes. We kindly ask guests to refrain from wearing sportswear, shorts, or casual sandals.',
  },
  {
    question: 'What is your cancellation policy?',
    answer: 'We kindly request 24 hours notice for cancellations. For parties of 6 or more, we require 48 hours notice. Late cancellations may incur a fee.',
  },
  {
    question: 'Is parking available?',
    answer: 'Complimentary valet parking is available for all guests. Simply pull up to our entrance, and our attendants will take care of your vehicle.',
  },
  {
    question: 'Can I host a private event at Veloria?',
    answer: 'Yes, our private dining room accommodates up to 20 guests, and our terrace can host up to 50 for cocktail receptions. Contact our events team for customized packages.',
  },
  {
    question: 'Do you offer gift cards?',
    answer: 'Yes, Veloria gift cards are available in any denomination and can be purchased in-restaurant or by calling our reservations team.',
  },
];

export const restaurantInfo = {
  tagline: "Where Every Dish Becomes a Timeless Story",

  address: "Platinum Blue Sky, Near Khajuri Bus Stop",
  city: "Ahmedabad, Gujarat 382405",

  phone: "+91 9537248835",

  // ❌ email remove kar rahe hain
  hours: {
    lunch: "Mon-Fri: 12:00 PM - 3:00 PM",
    dinner: "Daily: 6:00 PM - 11:00 PM",
    brunch: "Sat-Sun: 11:00 AM - 3:00 PM",
  },
  social: {
    instagram: '@veloria.nyc',
    facebook: 'VeloriaNYC',
    twitter: '@VeloriaNYC',
  },
};
