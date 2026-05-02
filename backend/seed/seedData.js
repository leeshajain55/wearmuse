require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');

const connectDB = require('../config/db');

const categories = [
  { name: 'Men', slug: 'men', image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=400', description: 'Trendy menswear for the modern man' },
  { name: 'Women', slug: 'women', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400', description: 'Stylish womenswear for every occasion' },
  { name: 'Kids', slug: 'kids', image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400', description: 'Fun and comfortable kids fashion' },
  { name: 'Accessories', slug: 'accessories', image: 'https://images.unsplash.com/photo-1611923134239-b9be5816e23c?w=400', description: 'Complete your look with accessories' },
  { name: 'Footwear', slug: 'footwear', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', description: 'Step out in style' },
  { name: 'Beauty', slug: 'beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', description: 'Skincare, makeup, and more' },
];

const seedDB = async () => {
  try {
    await connectDB();
    console.log('🗑️  Clearing database...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Order.deleteMany({});

    // Create categories
    console.log('📁 Creating categories...');
    const createdCategories = await Category.insertMany(categories);
    const catMap = {};
    createdCategories.forEach(c => { catMap[c.name] = c._id; });

    // Create users
    console.log('👤 Creating users...');
    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin@styleverse.com',
      password: 'admin123',
      role: 'admin',
    });
    const testUser = await User.create({
      name: 'Test User',
      email: 'user@test.com',
      password: 'test123',
      role: 'user',
    });

    // Create products
    console.log('🛍️  Creating products...');
    const products = [
      // MEN
      {
        name: 'Oversized Graphic Hoodie',
        description: 'Ultra-comfortable oversized hoodie with bold graphic print. Made from premium cotton blend fleece. Perfect for layering or wearing solo during those chill evenings.',
        price: 1999,
        originalPrice: 3499,
        category: catMap['Men'],
        images: [
          'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600',
          'https://images.unsplash.com/photo-1578768079470-96340a66df1a?w=600',
        ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Black', 'Grey', 'Navy'],
        stock: 50,
        brand: 'UrbanEdge',
        tags: ['trending', 'bestseller'],
        reviews: [
          { user: testUser._id, userName: 'Test User', rating: 5, comment: 'Amazing quality! The fit is perfect.' },
        ],
        rating: { average: 5, count: 1 },
      },
      {
        name: 'Slim Fit Cargo Pants',
        description: 'Modern cargo pants with a slim silhouette. Multiple pockets for utility, tapered leg for style. Stretch fabric for all-day comfort.',
        price: 1499,
        originalPrice: 2499,
        category: catMap['Men'],
        images: [
          'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600',
          'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600',
        ],
        sizes: ['28', '30', '32', '34', '36'],
        colors: ['Khaki', 'Black', 'Olive'],
        stock: 40,
        brand: 'StreetCred',
        tags: ['new-arrival'],
        reviews: [],
        rating: { average: 0, count: 0 },
      },
      {
        name: 'Vintage Wash Denim Jacket',
        description: 'Classic denim jacket with a vintage wash finish. Features button closure, chest pockets, and a slightly cropped fit for modern styling.',
        price: 2799,
        originalPrice: 4499,
        category: catMap['Men'],
        images: [
          'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600',
          'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600',
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Light Blue', 'Dark Blue'],
        stock: 25,
        brand: 'DenimCo',
        tags: ['trending'],
        reviews: [
          { user: testUser._id, userName: 'Test User', rating: 4, comment: 'Great jacket, love the vintage look!' },
        ],
        rating: { average: 4, count: 1 },
      },
      {
        name: 'Essential Cotton Crew Tee',
        description: 'Your everyday essential. Premium 100% cotton crew neck t-shirt with a relaxed fit. Available in multiple colors to mix and match.',
        price: 599,
        originalPrice: 999,
        category: catMap['Men'],
        images: [
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
          'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600',
        ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['White', 'Black', 'Grey', 'Navy', 'Olive'],
        stock: 100,
        brand: 'StyleVerse',
        tags: ['bestseller'],
        reviews: [],
        rating: { average: 0, count: 0 },
      },
      // WOMEN
      {
        name: 'Floral Wrap Midi Dress',
        description: 'Stunning floral print wrap dress in flowing fabric. Features a flattering V-neckline, adjustable tie waist, and midi length. Perfect for brunches and date nights.',
        price: 2499,
        originalPrice: 3999,
        category: catMap['Women'],
        images: [
          'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600',
          'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600',
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Floral Pink', 'Floral Blue'],
        stock: 35,
        brand: 'BloomStyle',
        tags: ['new-arrival', 'trending'],
        reviews: [
          { user: testUser._id, userName: 'Test User', rating: 5, comment: 'Beautiful dress! Got so many compliments.' },
        ],
        rating: { average: 5, count: 1 },
      },
      {
        name: 'Cropped Ribbed Tank Top',
        description: 'Chic cropped tank top in soft ribbed fabric. Perfect for high-waisted bottoms. The square neckline adds a touch of elegance to this casual essential.',
        price: 799,
        originalPrice: 1299,
        category: catMap['Women'],
        images: [
          'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=600',
          'https://images.unsplash.com/photo-1564246544814-5928a09d4652?w=600',
        ],
        sizes: ['XS', 'S', 'M', 'L'],
        colors: ['White', 'Black', 'Beige', 'Pink'],
        stock: 60,
        brand: 'VibeCheck',
        tags: ['bestseller'],
        reviews: [],
        rating: { average: 0, count: 0 },
      },
      {
        name: 'High-Waist Wide Leg Jeans',
        description: 'Retro-inspired wide leg jeans with a high waist for a flattering silhouette. Made from premium stretch denim for comfort all day long.',
        price: 1899,
        originalPrice: 2999,
        category: catMap['Women'],
        images: [
          'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600',
          'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=600',
        ],
        sizes: ['24', '26', '28', '30', '32'],
        colors: ['Light Blue', 'Dark Blue', 'Black'],
        stock: 45,
        brand: 'DenimCo',
        tags: ['trending'],
        reviews: [],
        rating: { average: 0, count: 0 },
      },
      {
        name: 'Puff Sleeve Blouse',
        description: 'Romantic puff sleeve blouse in lightweight fabric. Features a sweetheart neckline and back tie closure. Dressy enough for work, cute enough for weekends.',
        price: 1299,
        originalPrice: 2199,
        category: catMap['Women'],
        images: [
          'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=600',
          'https://images.unsplash.com/photo-1551803091-e20673f15770?w=600',
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['White', 'Lavender', 'Dusty Rose'],
        stock: 30,
        brand: 'BloomStyle',
        tags: ['new-arrival'],
        reviews: [],
        rating: { average: 0, count: 0 },
      },
      // KIDS
      {
        name: 'Rainbow Stripe Kids Tee',
        description: 'Fun and colorful rainbow stripe t-shirt for kids. Made from soft, breathable cotton that\'s gentle on young skin. Easy to wash and wear.',
        price: 499,
        originalPrice: 799,
        category: catMap['Kids'],
        images: [
          'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600',
          'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=600',
        ],
        sizes: ['3-4Y', '5-6Y', '7-8Y', '9-10Y'],
        colors: ['Rainbow', 'Blue Stripe'],
        stock: 70,
        brand: 'KiddoStyle',
        tags: ['bestseller'],
        reviews: [],
        rating: { average: 0, count: 0 },
      },
      {
        name: 'Dino Print Jogger Set',
        description: 'Adorable dinosaur print jogger set including a matching hoodie and pants. Super soft fleece material perfect for play and nap time.',
        price: 899,
        originalPrice: 1499,
        category: catMap['Kids'],
        images: [
          'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600',
          'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600',
        ],
        sizes: ['2-3Y', '3-4Y', '5-6Y', '7-8Y'],
        colors: ['Green', 'Blue'],
        stock: 40,
        brand: 'KiddoStyle',
        tags: ['new-arrival'],
        reviews: [],
        rating: { average: 0, count: 0 },
      },
      // ACCESSORIES
      {
        name: 'Canvas Bucket Hat',
        description: 'Trendy bucket hat made from durable canvas. UPF 50+ sun protection with a comfortable inner sweatband. The ultimate Gen Z accessory.',
        price: 699,
        originalPrice: 1099,
        category: catMap['Accessories'],
        images: [
          'https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=600',
          'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600',
        ],
        sizes: ['One Size'],
        colors: ['Beige', 'Black', 'White', 'Sage'],
        stock: 80,
        brand: 'UrbanEdge',
        tags: ['trending', 'bestseller'],
        reviews: [
          { user: testUser._id, userName: 'Test User', rating: 4, comment: 'Love this hat! Perfect for sunny days.' },
        ],
        rating: { average: 4, count: 1 },
      },
      {
        name: 'Layered Chain Necklace Set',
        description: 'Set of 3 layered chain necklaces in gold-tone finish. Mix and match or wear them all together for maximum impact. Hypoallergenic and tarnish-resistant.',
        price: 899,
        originalPrice: 1599,
        category: catMap['Accessories'],
        images: [
          'https://images.unsplash.com/photo-1611923134239-b9be5816e23c?w=600',
          'https://images.unsplash.com/photo-1515562141589-67f0d9e6a2b5?w=600',
        ],
        sizes: ['One Size'],
        colors: ['Gold', 'Silver'],
        stock: 55,
        brand: 'GlowUp',
        tags: ['trending'],
        reviews: [],
        rating: { average: 0, count: 0 },
      },
      {
        name: 'Oversized Square Sunglasses',
        description: 'Bold oversized square sunglasses with UV400 protection. Acetate frame with gradient lenses. Channel your inner celebrity with these statement sunnies.',
        price: 1299,
        originalPrice: 2199,
        category: catMap['Accessories'],
        images: [
          'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600',
          'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600',
        ],
        sizes: ['One Size'],
        colors: ['Black', 'Tortoise', 'Pink'],
        stock: 45,
        brand: 'VibeCheck',
        tags: ['new-arrival', 'trending'],
        reviews: [],
        rating: { average: 0, count: 0 },
      },
      {
        name: 'Mini Crossbody Bag',
        description: 'Compact yet spacious mini crossbody bag in faux leather. Features an adjustable strap, zip closure, and card slots inside. Your go-to for nights out.',
        price: 1499,
        originalPrice: 2499,
        category: catMap['Accessories'],
        images: [
          'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600',
          'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600',
        ],
        sizes: ['One Size'],
        colors: ['Black', 'Tan', 'White', 'Pink'],
        stock: 35,
        brand: 'StyleVerse',
        tags: ['bestseller'],
        reviews: [],
        rating: { average: 0, count: 0 },
      },
      // FOOTWEAR
      {
        name: 'Chunky Platform Sneakers',
        description: 'Statement chunky sneakers with a 4cm platform sole. Breathable mesh upper with leather accents. Lightweight despite the bold look.',
        price: 3499,
        originalPrice: 5499,
        category: catMap['Footwear'],
        images: [
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
          'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600',
        ],
        sizes: ['UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'],
        colors: ['White/Pink', 'Black/White', 'All White'],
        stock: 30,
        brand: 'StepUp',
        tags: ['trending', 'bestseller'],
        reviews: [
          { user: testUser._id, userName: 'Test User', rating: 5, comment: 'So comfortable and stylish! Worth every penny.' },
        ],
        rating: { average: 5, count: 1 },
      },
      {
        name: 'Cloud Comfort Slides',
        description: 'Ultra-soft EVA foam slides for maximum comfort. Textured footbed for grip, waterproof design perfect for pool days and lazy weekends.',
        price: 799,
        originalPrice: 1299,
        category: catMap['Footwear'],
        images: [
          'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600',
          'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?w=600',
        ],
        sizes: ['UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
        colors: ['Black', 'White', 'Sage', 'Lilac'],
        stock: 90,
        brand: 'StepUp',
        tags: ['bestseller'],
        reviews: [],
        rating: { average: 0, count: 0 },
      },
      {
        name: 'Chelsea Ankle Boots',
        description: 'Sleek Chelsea boots with elastic side panels and pull tab. Genuine suede upper with a cushioned insole. Elevate any outfit instantly.',
        price: 3999,
        originalPrice: 5999,
        category: catMap['Footwear'],
        images: [
          'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=600',
          'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600',
        ],
        sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'],
        colors: ['Black', 'Brown', 'Tan'],
        stock: 20,
        brand: 'UrbanEdge',
        tags: ['new-arrival'],
        reviews: [],
        rating: { average: 0, count: 0 },
      },
      // BEAUTY
      {
        name: 'Dewy Glow Serum',
        description: 'Lightweight hydrating serum with hyaluronic acid and vitamin C. Gives your skin that coveted glass-skin glow. Suitable for all skin types.',
        price: 1299,
        originalPrice: 1999,
        category: catMap['Beauty'],
        images: [
          'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600',
          'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600',
        ],
        sizes: ['30ml', '50ml'],
        colors: [],
        stock: 65,
        brand: 'GlowUp',
        tags: ['trending', 'bestseller'],
        reviews: [],
        rating: { average: 0, count: 0 },
      },
      {
        name: 'Matte Lip Kit Bundle',
        description: 'Set of 4 long-lasting matte liquid lipsticks in curated shades. Transfer-proof formula that lasts up to 12 hours. Enriched with vitamin E.',
        price: 999,
        originalPrice: 1799,
        category: catMap['Beauty'],
        images: [
          'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600',
          'https://images.unsplash.com/photo-1631214500115-598fc2cb8ada?w=600',
        ],
        sizes: ['One Size'],
        colors: ['Nude Collection', 'Berry Collection', 'Red Collection'],
        stock: 50,
        brand: 'GlowUp',
        tags: ['new-arrival', 'bestseller'],
        reviews: [],
        rating: { average: 0, count: 0 },
      },
      {
        name: 'Retro High-Top Sneakers',
        description: 'Classic high-top sneakers with a retro vibe. Canvas upper with rubber sole. Timeless style that goes with everything from jeans to dresses.',
        price: 2499,
        originalPrice: 3499,
        category: catMap['Footwear'],
        images: [
          'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=600',
          'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600',
        ],
        sizes: ['UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'],
        colors: ['White', 'Black', 'Red'],
        stock: 40,
        brand: 'StepUp',
        tags: ['new-arrival', 'trending'],
        reviews: [],
        rating: { average: 0, count: 0 },
      },
      {
        name: 'Tie-Dye Oversized Tee',
        description: 'Groovy tie-dye t-shirt in an oversized fit. Each piece is uniquely dyed for a one-of-a-kind look. 100% cotton for breathability.',
        price: 899,
        originalPrice: 1499,
        category: catMap['Men'],
        images: [
          'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=600',
          'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600',
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Purple Haze', 'Ocean Blue', 'Sunset Orange'],
        stock: 35,
        brand: 'VibeCheck',
        tags: ['new-arrival', 'trending'],
        reviews: [],
        rating: { average: 0, count: 0 },
      },
      {
        name: 'Satin Midi Skirt',
        description: 'Elegant satin midi skirt with a high waist and subtle shine. Features a hidden side zip and back slit. Dress it up or down effortlessly.',
        price: 1699,
        originalPrice: 2799,
        category: catMap['Women'],
        images: [
          'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600',
          'https://images.unsplash.com/photo-1592301933927-35b597393c0a?w=600',
        ],
        sizes: ['XS', 'S', 'M', 'L'],
        colors: ['Champagne', 'Black', 'Emerald'],
        stock: 25,
        brand: 'BloomStyle',
        tags: ['trending', 'sale'],
        reviews: [],
        rating: { average: 0, count: 0 },
      },
    ];

    await Product.insertMany(products);

    console.log('✅ Database seeded successfully!');
    console.log(`   📁 ${createdCategories.length} categories`);
    console.log(`   🛍️  ${products.length} products`);
    console.log(`   👤 2 users (admin + test)`);
    console.log('\n   Admin: admin@styleverse.com / admin123');
    console.log('   User:  user@test.com / test123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDB();
