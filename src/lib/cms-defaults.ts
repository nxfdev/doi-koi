import { Product, SiteContent, DeliveryZone } from './types';

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod_mishti_doi',
    slug: 'mishti-doi',
    name: 'Mishti Doi',
    bengaliName: 'বগুড়ার ঐতিহ্যবাহী মিষ্টি দই',
    price: 350,
    tagline: 'The timeless caramelized classic in red clay pots',
    description:
      'Authentic Bogura Mishti Doi, crafted by slow-boiling pure cow milk in wood-fired earthen ovens for over 12 hours until deep natural caramelization occurs. Poured into porous terracotta shora where natural evaporation creates an exceptionally thick, velvety curd topped with a glistening caramelized cream layer.',
    weight: '1 kg (Standard Shora)',
    potType: 'Bogura Terracotta Earthen Pot',
    ingredients: [
      'Pure full-cream cow milk from Bogura pastures',
      'Refined cane sugar (caramelized)',
      'Traditional mother culture (Doi-er beej)',
    ],
    nutritionalInfo: {
      calories: '185 kcal per 100g',
      protein: '4.8g',
      fat: '5.2g',
      carbs: '28.0g',
    },
    storageInstructions:
      'Keep refrigerated between 2°C and 5°C in its original clay pot. Do not freeze.',
    shelfLife: '5 to 7 days from production date under refrigeration.',
    stock: 25,
    isAvailable: true,
    isFeatured: true,
    images: ['/assets/home/hero/hero-doi.png'],
  },
  {
    id: 'prod_diabetic_doi',
    slug: 'diabetic-doi',
    name: 'Diabetic Doi',
    bengaliName: 'ডায়াবেটিক ফ্রেন্ডলি টক-মিষ্টি দই',
    price: 450,
    tagline: 'Zero added sugar, pure traditional slow-fermented curd',
    description:
      'Carefully crafted for health-conscious patrons and diabetics. Prepared from premium reduced cow milk without any added sugar or artificial sweeteners. The natural fermentation creates a mildly tangy, deeply nourishing curd with full earthen pot minerals and authentic texture.',
    weight: '1 kg (Standard Shora)',
    potType: 'Bogura Terracotta Earthen Pot',
    ingredients: [
      'Pure skimmed & full-cream cow milk',
      'Active probiotics & lactic culture',
      'Zero added sugar',
    ],
    nutritionalInfo: {
      calories: '98 kcal per 100g',
      protein: '5.6g',
      fat: '3.8g',
      carbs: '8.4g',
    },
    storageInstructions: 'Refrigerate at 2°C to 4°C. Consume within 6 days.',
    shelfLife: '6 days under refrigeration.',
    stock: 18,
    isAvailable: true,
    isFeatured: true,
    images: ['/assets/home/hero/hero-doi.png'],
  },
  {
    id: 'prod_shahi_doi',
    slug: 'shahi-doi',
    name: 'Shahi Doi',
    bengaliName: 'শাহী জাফরানি ক্ষীর দই',
    price: 500,
    tagline: 'Imperial recipe enriched with reduced malai & cardamom',
    description:
      'A decadent culinary jewel inspired by Bogura nawabi kitchens. Ultra-rich cow milk simmered down to dense rabri, blended with subtle touches of cardamom and saffron notes, set in hand-thrown terracotta pots for a royally creamy, luxurious dessert.',
    weight: '1 kg (Royal Deep Shora)',
    potType: 'Glazed Bogura Artisanal Terracotta Pot',
    ingredients: [
      'Extra-thick reduced cow milk & malai',
      'Organic raw sugar',
      'Green cardamom infusion',
      'Heritage curd cultures',
    ],
    nutritionalInfo: {
      calories: '220 kcal per 100g',
      protein: '6.2g',
      fat: '8.5g',
      carbs: '29.5g',
    },
    storageInstructions:
      'Store chilled at 2°C to 4°C. Best enjoyed cold within 5 days.',
    shelfLife: '5 days from dispatch.',
    stock: 12,
    isAvailable: true,
    isFeatured: true,
    images: ['/assets/home/hero/hero-doi.png'],
  },
  {
    id: 'prod_kheersha',
    slug: 'kheersha',
    name: 'Kheersha',
    bengaliName: 'বগুড়ার খাঁটি ক্ষীরশা',
    price: 0, // Unset price: will be set by admin as requested
    tagline: 'Traditional concentrated milk delicacy crafted over low wood embers',
    description:
      'Authentic Bogura Kheersha — dense, velvety, slow-cooked caramelized milk pudding prepared by gently stirring pure whole cow milk over wood embers for hours until it thickens into golden, aromatic indulgence.',
    weight: '500g / 1kg Pack',
    potType: 'Traditional Earthen Handi',
    ingredients: [
      'Pure whole cow milk condensed to solid consistency',
      'Natural raw cane sugar',
      'Aromatic spices',
    ],
    nutritionalInfo: {
      calories: '260 kcal per 100g',
      protein: '7.8g',
      fat: '11.0g',
      carbs: '32.0g',
    },
    storageInstructions: 'Refrigerate at 2°C to 5°C. Consume within 7 days.',
    shelfLife: '7 days under refrigeration.',
    stock: 15,
    isAvailable: true,
    isFeatured: false,
    images: ['/assets/home/hero/hero-doi.png'],
  },
];

export const DEFAULT_DELIVERY_ZONES: DeliveryZone[] = [
  {
    id: 'zone_dhaka_central',
    name: 'Inside Dhaka (Standard Delivery)',
    description: 'Direct temperature-controlled delivery across Dhaka metropolitan area',
    fee: 80,
    estimatedDays: 'Same-day or Next-day (within 24 hrs)',
    isActive: true,
  },
  {
    id: 'zone_dhaka_express',
    name: 'Inside Dhaka (Same-Day Express)',
    description: 'Guaranteed delivery within 4 to 6 hours in specialized insulated bags',
    fee: 150,
    estimatedDays: 'Within 4-6 hours',
    isActive: true,
  },
  {
    id: 'zone_outside_dhaka',
    name: 'Outside Dhaka / Nationwide Courier',
    description: 'Chilled express logistics to major district headquarters across Bangladesh',
    fee: 160,
    estimatedDays: '24 to 48 hours',
    isActive: true,
  },
];

export const DEFAULT_SITE_CONTENT: SiteContent = {
  hero: {
    tagline: 'Bogura at your doorsteps',
    subheading: 'Traditional product. Contemporary presentation.',
    ctaText: 'ORDER NOW',
    speedSeconds: 60,
  },
  about: {
    heading: 'The Art of Authentic Bogura Doi',
    subheading: 'Tradition meets uncompromising quality.',
    bodyParagraphs: [
      'Doi Koi was born out of deep reverence for Bogura’s two-century-old culinary heritage. For generations, the master artisans of Bogura have perfected the delicate science of caramelizing pure cow milk inside porous earthen pots.',
      'Unlike factory-made yogurt, true Bogura doi relies on unhurried patience: whole milk simmering over slow wood fires, developing its iconic russet crust and silken depth naturally, without synthetic additives or artificial stabilizers.',
      'Our mission is singular: to preserve this time-honored craft and bring authentic Bogura doi directly to your doorsteps across Bangladesh, packaged in traditional terracotta pots that breathe and keep the curd perfectly chilled.',
    ],
    videoUrl: '/assets/home/about/about-video.mp4',
    videoPoster: '/assets/home/hero/hero-doi.png',
    autoplay: false,
    loop: true,
    muted: true,
  },
  heritage: {
    heading: 'Centuries of Earthen Craft',
    intro:
      'Bogura is celebrated as the undisputed birthplace of authentic Bengali doi. Each batch is a living tribute to the artisans whose hands shape the clay and slow-simmer the golden milk.',
    timeline: [
      {
        phase: '01 — ORIGIN',
        title: 'The Bogura Heritage',
        description:
          'Originating in the verdant pastures of northern Bengal, Bogura doi has earned geographical prestige for its unmatched flavor, enriched by unique local micro-climate and heritage cultures.',
      },
      {
        phase: '02 — THE CLAY',
        title: 'Handcrafted Terracotta Shora',
        description:
          'Local potters mold unglazed earthen pots from riverbed silt. The porous clay naturally absorbs excess whey, condensing the yogurt into a dense, creamy texture.',
      },
      {
        phase: '03 — THE SIMMER',
        title: 'Wood-Fired Slow Caramelization',
        description:
          'Pure, whole cow milk is slowly reduced over tamarind-wood fires for 12 hours. Natural milk sugars caramelize into the signature reddish-brown crust called “Shor”.',
      },
      {
        phase: '04 — THE FERMENT',
        title: 'Overnight Natural Setting',
        description:
          'Inoculated with generations-old mother culture, the warm milk rests overnight in straw-insulated chambers, emerging as solid, spoon-thick doi by dawn.',
      },
      {
        phase: '05 — YOUR DOORSTEP',
        title: 'Fresh Journey to Dhaka & Beyond',
        description:
          'Carefully dispatched in insulated containers directly from Bogura kitchens to dining tables in Dhaka and across Bangladesh.',
      },
    ],
  },
  map: {
    heading: 'The Journey from Bogura to Your Doorstep',
    subheading: 'From the historic hearths of Bogura straight to Dhaka city',
    originName: 'Bogura (বগুড়া)',
    originDetail: 'Heritage ovens & artisanal clay shora setting',
    destinationName: 'Dhaka & Nationwide',
    destinationDetail: 'Chilled delivery at your doorsteps',
  },
  productStory: {
    heading: 'Purity in Every Clay Shora',
    quote:
      '“A spoonful of authentic Bogura doi should linger with the earthy perfume of riverbed clay, caramel, and pure milk cream.”',
    artisanNote:
      'No gelatins, no artificial colors, no shortcuts. Just pure milk, slow fire, and two centuries of northern pride.',
  },
  footer: {
    tagline: 'Bogura at your doorsteps',
    address: 'Bogura Dispatch Center: Sherpur Road, Bogura | Dhaka Hub: Banani & Dhanmondi, Dhaka',
    phone: '+880 1700-000000',
    email: 'hello@doikoi.com',
    hours: 'Dispatching 7 days a week: 8:00 AM – 10:00 PM',
    copyright: '© 2026 DOI KOI. All rights reserved. Traditional product. Contemporary presentation.',
  },
};
